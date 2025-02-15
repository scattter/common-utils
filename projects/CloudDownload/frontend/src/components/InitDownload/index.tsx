import {
  Button,
  Divider,
  Empty,
  Input,
  Progress,
  Spin,
  Tree,
  type TreeDataNode,
  type TreeProps,
} from 'antd';
import axios from 'axios';
import _ from 'lodash';
import type React from 'react';
import { useMemo } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import { SSE_EVENT, VALID_INFO_TYPE } from '../../enums';
import type { IFileInfo, IServerFolderInfo } from '../../interfaces';
import InfoCard from '../InfoCard';
import { InputDialog } from '../InputDialog';
import styles from './index.module.scss';

const ROOT_PATH = '../download'

const InitDownload: React.FC = () => {
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [sharePwd, setSharePwd] = useState<string>('');
  const [isFinding, setIsFinding] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<(IFileInfo & TreeDataNode)[]>([]);
  const [loadingText, setLoadingText] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>(ROOT_PATH);
  const [curFolder, setCurFolder] = useState<IServerFolderInfo>({
    basePath: '',
    files: [],
  });
  const [downloadContent, setDownloadContent] = useState<
    {
      title: string;
      progress: number;
      total?: number;
      error?: boolean;
    }[]
  >([]);

  const checkedTree = useMemo(() => {
    if (checkedKeys.length === 0) return treeData;
    const copyTree = _.cloneDeep(treeData);
    const fun = (tree: IFileInfo[]) => {
      for (const copyTreeElement of tree) {
        copyTreeElement.checked = checkedKeys.includes(copyTreeElement.id);
        if (copyTreeElement.children && copyTreeElement.children.length > 0) {
          fun(copyTreeElement.children);
        }
      }
    };
    fun(copyTree);
    return copyTree;
  }, [checkedKeys, treeData]);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  const handleParseUrl = useCallback(() => {
    setIsFinding(true);
    setLoadingText('文件解析中');
    axios
      .post('/file/parse', { downloadUrl, sharePwd })
      .then((res) => {
        setTreeData(res.data);
      })
      .finally(() => {
        setIsFinding(false);
        setLoadingText('');
      });
  }, [downloadUrl, sharePwd]);

  const handleQueryFolder = useCallback(() => {
    axios
      .post('/file/folder', { baseUrl })
      .then((res) => {
        setCurFolder(res.data);
      })
      .finally(() => {
        // setIsFinding(false);
      });
  }, [baseUrl]);

  useEffect(() => {
    const eventSource = new EventSource('/sse');
    eventSource.addEventListener(SSE_EVENT.START_PARSE, (e) => {
      const data = JSON.parse(e.data ?? {});
      setLoadingText(data.message);
    });

    eventSource.addEventListener(SSE_EVENT.NEED_PHONE, (e) => {
      const data: { message: string } = JSON.parse(e.data ?? {});
      InputDialog.open({
        title: data.message,
        onOk: (val) => {
          return axios.post('/file/updateValid', {
            type: VALID_INFO_TYPE.PHONE,
            val,
          });
        },
        onClose: () => {
          return axios.get('/file/abort');
        },
      });
    });

    eventSource.addEventListener(SSE_EVENT.NEED_SMS_CODE, (e) => {
      const data: { message: string } = JSON.parse(e.data ?? {});
      InputDialog.open({
        title: data.message,
        onOk: (val) => {
          return axios.post('/file/updateValid', {
            type: VALID_INFO_TYPE.SMS_CODE,
            val,
          });
        },
        onClose: () => {
          return axios.get('/file/abort');
        },
      });
    });

    eventSource.addEventListener(SSE_EVENT.PHASE_START_DOWN, (e) => {
      const data: { title: string } = JSON.parse(e.data ?? {});
      setDownloadContent((prev) => {
        return [
          ...prev,
          {
            title: data.title,
            progress: 0,
          },
        ];
      });
    });

    eventSource.addEventListener(SSE_EVENT.PROCESSING, (e) => {
      const data: { title: string; progress: number; total: number } =
        JSON.parse(e.data ?? {});
      setDownloadContent((prev) => {
        return prev.map((item) => {
          if (item.title === data.title) {
            return {
              ...item,
              progress: data.progress,
              total: data.total,
            };
          }
          return item;
        });
      });
    });

    eventSource.addEventListener(SSE_EVENT.PHASE_FINISH, (e) => {
      const data: { title: string } = JSON.parse(e.data ?? {});
      // setDownloadContent(prev => prev + data.message)
      setDownloadContent((prev) => {
        return prev.map((item) => {
          if (item.title === data.title) {
            return {
              ...item,
              progress: 100,
            };
          }
          return item;
        });
      });
    });

    eventSource.addEventListener(SSE_EVENT.PHASE_ERROR, (e) => {
      const data: { title: string } = JSON.parse(e.data ?? {});
      // setDownloadContent(prev => prev + data.message)
      setDownloadContent((prev) => {
        return prev.map((item) => {
          if (item.title === data.title) {
            return {
              ...item,
              error: true,
            };
          }
          return item;
        });
      });
    });

    // eventSource.addEventListener(SSE_EVENT.FINISH, (e) => {
    //   const data: { message: string } = JSON.parse(e.data ?? {});
    //   setDownloadContent(prev => prev + data.message)
    // })

    eventSource.addEventListener('error', (e) => {
      console.log(e);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    handleQueryFolder();
  }, [handleQueryFolder]);

  return (
    <div className={styles.initWrapper}>
      <div className={styles.infoWrapper}>
        <Input
          style={{ width: '40%' }}
          disabled={isFinding}
          placeholder={'请输入要下载的地址'}
          onChange={(val) => setDownloadUrl(val.target.value)}
        />
        <Input
          style={{ width: '40%' }}
          disabled={isFinding}
          placeholder={'请输入下载地址访问码(如果有)'}
          onChange={(val) => setSharePwd(val.target.value)}
        />
        <Button
          style={{ width: '20%' }}
          type="primary"
          loading={isFinding}
          onClick={handleParseUrl}
        >
          解析链接
        </Button>
      </div>
      <div className={styles.fileWrapper}>
        <div className={styles.treeWrapper}>
          <Spin
            spinning={isFinding}
            tip={loadingText}
          >
            {treeData.length > 0 ? (
              <Tree
                rootStyle={{
                  width: '100%',
                  height: '100%',
                  padding: 16,
                  overflow: 'auto',
                }}
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                selectable={false}
                fieldNames={{
                  key: 'id',
                  title: 'name',
                }}
                treeData={treeData as TreeDataNode[]}
              />
            ) : (
              !isFinding && <div>
                <Empty />
              </div>
            )}
          </Spin>
        </div>
        <div className={styles.operationWrapper}>
          <div className={styles.content}>
            <div className={styles.folderWrapper}>
              <div className={styles.curPath}>
                <span>{`下载路径: ${curFolder.basePath.replace(ROOT_PATH, '/')}`}</span>
                <Button
                  disabled={baseUrl === ROOT_PATH}
                  type="link"
                  onClick={() => {
                    setBaseUrl((prevState) => {
                      const ls = prevState.split('/');
                      ls.pop();
                      return ls.join('/');
                    });
                  }}
                >
                  返回上一级
                </Button>
              </div>
              <Divider style={{ margin: '6px 0' }} />
              <div className={styles.folderDetail}>
                {curFolder.files.map((file) => {
                  return (
                    <div key={`${file.name}-${file.isDirectory}`}>
                      {file.isDirectory ? (
                        <Button
                          style={{ fontSize: 16 }}
                          type={'link'}
                          onClick={() =>
                            setBaseUrl(
                              (prevUrl) =>
                                `${prevUrl}${prevUrl.endsWith('/') ? '' : '/'}${file.name}`,
                            )
                          }
                        >
                          {file.name}
                        </Button>
                      ) : (
                        <div style={{ paddingLeft: 16 }}>{file.name}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <Button
              // disabled={checkedKeys.length === 0}
              type="primary"
              onClick={() => {
                axios.post('file/download', { files: checkedTree, baseUrl });
              }}
            >
              下载
            </Button>
          </div>
          <div className={styles.processWrapper}>
            <InfoCard
              content={downloadContent.map((content) => {
                return (
                  <div key={content.title} style={{ width: '100%' }}>
                    <div>{content.title}</div>
                    <div style={{ display: 'flex' }}>
                      <Progress
                        style={{ flexGrow: 1 }}
                        percent={content.progress}
                        size={{ height: 20 }}
                        percentPosition={{ align: 'center', type: 'inner' }}
                        status={content.error ? 'exception' : 'normal'}
                      />
                      <div
                        style={{
                          width: '80px',
                          marginLeft: 10,
                          textAlign: 'center',
                        }}
                      >
                        {content.total ? `${content.total}M` : '--'}
                      </div>
                    </div>
                  </div>
                );
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(InitDownload);
