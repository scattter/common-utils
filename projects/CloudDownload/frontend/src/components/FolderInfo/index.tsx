import { SyncOutlined } from '@ant-design/icons';
import { Button, Divider, type TreeDataNode, message } from 'antd';
import axios from 'axios';
import type React from 'react';
import { useCallback } from 'react';
import { memo, useState } from 'react';
import { ROOT_PATH } from '../../consts';
import type { IFileInfo, IServerFolderInfo } from '../../interfaces';
import { InputDialog } from '../InputDialog';
import styles from './index.module.scss';

interface IProps {
  checkedTree: (IFileInfo & TreeDataNode)[];
}

const FolderInfo: React.FC<IProps> = ({ checkedTree }) => {
  const [baseUrl, setBaseUrl] = useState<string>(ROOT_PATH);
  const [curFolder, setCurFolder] = useState<IServerFolderInfo>({
    basePath: '',
    files: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasQuery, setHasQuery] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleQueryFolder = useCallback((baseUrl: string) => {
    setLoading(true);
    axios
      .post('/file/folder', { baseUrl })
      .then((res) => {
        setCurFolder(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateFolder = useCallback(() => {
    InputDialog.open({
      title: '新建文件夹',
      onOk: async (val) => {
        const {
          data,
        }: {
          data: {
            isSuccess: boolean;
            message?: string;
          };
        } = await axios.post('file/createFolder', {
          baseUrl: `${baseUrl}/${val}`,
        });
        if (data.isSuccess) {
          messageApi.success(data.message);
          handleQueryFolder(baseUrl);
          return Promise.resolve();
        }
        messageApi.error(data.message);
        return Promise.reject();
      },
    });
  }, [baseUrl, handleQueryFolder, messageApi]);

  return (
    <>
      {contextHolder}
      <div className={styles.folderWrapper}>
        <div className={styles.curPath}>
          <span>
            <SyncOutlined
              style={{ marginRight: 4 }}
              spin={loading}
              onClick={() => handleQueryFolder(baseUrl)}
            />
            {`下载路径: ${baseUrl.replace(ROOT_PATH, '')}`}
          </span>
          <div>
            <Button disabled={!hasQuery} onClick={handleCreateFolder}>
              新建文件夹
            </Button>
            <Button
              disabled={baseUrl === ROOT_PATH}
              type="link"
              onClick={() => {
                const updatedUrl = baseUrl.split('/');
                updatedUrl.pop();
                setBaseUrl(updatedUrl.join('/'));
                handleQueryFolder(updatedUrl.join('/'));
              }}
            >
              返回上一级
            </Button>
          </div>
        </div>
        <Divider style={{ margin: '6px 0' }} />
        <div className={styles.folderDetail}>
          {hasQuery ? (
            curFolder.files.map((file) => {
              return (
                <div key={`${file.name}-${file.isDirectory}`}>
                  {file.isDirectory ? (
                    <Button
                      style={{ fontSize: 16 }}
                      type={'link'}
                      onClick={() => {
                        const updatedUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${file.name}`;
                        setBaseUrl(updatedUrl);
                        handleQueryFolder(updatedUrl);
                      }}
                    >
                      {file.name}
                    </Button>
                  ) : (
                    <div style={{ paddingLeft: 16 }}>{file.name}</div>
                  )}
                </div>
              );
            })
          ) : (
            <div className={styles.iconWrapper}>
              <SyncOutlined
                className={styles.freshIcon}
                spin={loading}
                onClick={() => {
                  setHasQuery(true);
                  handleQueryFolder(baseUrl);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        disabled={!hasQuery || checkedTree.length === 0}
        type="primary"
        onClick={() => {
          axios.post('file/download', { files: checkedTree, baseUrl });
        }}
      >
        下载
      </Button>
    </>
  );
};

export default memo(FolderInfo);
