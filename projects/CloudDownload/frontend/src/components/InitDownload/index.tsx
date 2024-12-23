import {
  Button,
  Input,
  Spin,
  Tree,
  type TreeDataNode,
  type TreeProps,
} from 'antd';
import axios from 'axios';
import type React from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { memo } from 'react';
import type { IFileInfo } from '../../interfaces';
import styles from './index.module.scss';

const InitDownload: React.FC = () => {
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [sharePwd, setSharePwd] = useState<string>('');
  const [isFinding, setIsFinding] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<(IFileInfo & TreeDataNode)[]>([]);
  const [loadingText, setLoadingText] = useState<string>('');

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const handleParseUrl = useCallback(() => {
    setIsFinding(true);
    setLoadingText('文件解析中');
    axios
      .post('/file/parse', { downloadUrl, sharePwd })
      .then((res) => {
        console.log(res.data);
        setTreeData(res.data);
      })
      .finally(() => {
        setIsFinding(false);
        setLoadingText('');
      });
  }, [downloadUrl, sharePwd]);

  useEffect(() => {
    const eventSource = new EventSource('/sse');
    // eventSource.addEventListener('connected', (e) => {
    //   console.log(e);
    // });
    // eventSource.addEventListener('open', (e) => {
    //   console.log('open', e);
    // });
    eventSource.addEventListener('startParse', (e) => {
      const data = JSON.parse(e.data ?? {});
      setLoadingText(data.message);
    });
    // eventSource.addEventListener('error', (e) => {
    //   console.log('error', e);
    // });

    return () => {
      eventSource.close();
    };
  }, []);

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
        {isFinding ? (
          <Spin tip={loadingText} />
        ) : (
          <Tree
            rootStyle={{ width: '100%', height: '100%' }}
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            fieldNames={{
              key: 'id',
              title: 'name',
            }}
            treeData={treeData as TreeDataNode[]}
          />
        )}
      </div>
    </div>
  );
};

export default memo(InitDownload);
