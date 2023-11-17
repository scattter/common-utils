import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { unstable_batchedUpdates as batch } from 'react-dom';

const isCancel = (value: any) => !!value?.__CANCEL__;

/**
 * 18默认开启默认批处理
 * @param callback
 */
const batch: (callback: () => any) => void = (callback) => {
  callback();
};
/**
 * 单个请求处理
 * 例子
 * @param fetcher
 * @param defaultDate
 */
const useFetch = <Payload = object, Data = object>(
  fetcher: (payload: Payload, prevData: Data | undefined, abortController: AbortController) => Promise<Data>,
  defaultDate?: Data
) => {
  const [data, setData] = useState<Data | undefined>(defaultDate);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error>();
  const [cacheFetcher] = useState(() => fetcher); // 暂存fetcher
  const [fetchData, setFetchData] = useState<{ fetchId: number; payload: Payload | undefined }>({
    fetchId: 0,
    payload: undefined,
  });
  const cacheRef = useRef<{ isLoading: boolean; prevData: Data | undefined; prevPayload: Payload | undefined }>({
    isLoading: false,
    prevData: data,
    prevPayload: fetchData?.payload,
  });

  useMemo(() => {
    cacheRef.current.isLoading = isLoading;
    cacheRef.current.prevData = data;
  }, [isLoading, data]);

  useEffect(() => {
    if (fetchData.fetchId && fetchData.payload) {
      const abortController = new AbortController();
      cacheFetcher(fetchData.payload, cacheRef.current.prevData, abortController)
        .then((data) => {
          batch(() => {
            setData(data);
            setIsLoading(false);
            /* 仅在成功请求重置 prevPayload */
            cacheRef.current.prevPayload = fetchData.payload;
          });
        })
        .catch((error) => {
          batch(() => {
            if (!isCancel(error)) {
              // if (__DEV__) {
              //   console.error(error);
              // }
              setIsLoading(false);
              setHasError(true);
              setError(error);
            }
          });
        });
      return () => {
        abortController.abort();
      };
    }

    return () => {};
  }, [cacheFetcher, fetchData]);

  /**
   * 假如payload函数返回false表示不再触发发送请求
   * 处理搜索时，重制列表
   * 初始化各种状态, 这里处理后在具体请求的时候就不需要考虑请求失败, 重置数据等异常边界情况
   */
  const dispatch = useCallback(
    (
      payloader:
        | Payload
        | ((options: {
        prevPayload: Payload | undefined;
        isLoading: boolean;
        prevData: Data | undefined;
      }) => Payload | false),
      resetData?: (data: Data | undefined) => Data | undefined
    ) => {
      let payload: Payload;
      let cancel = false;
      if (payloader instanceof Function) {
        const state = payloader({
          prevPayload: cacheRef.current.prevPayload,
          isLoading: cacheRef.current.isLoading,
          prevData: cacheRef.current.prevData,
        });
        if (state === false) {
          cancel = true;
        } else {
          payload = state;
        }
      } else {
        payload = payloader;
      }

      batch(() => {
        if (!cancel) {
          setHasError(false);
          setError(undefined);
          setFetchData((prev) => {
            return { fetchId: prev.fetchId + 1, payload };
          });
          // 重置数据状态的时候不需要刷新页面 但是这里设置loading为true?
          // 手动触发loading, 默认不触发loading(无限列表的时候不触发loading)
          if (!(payload as any).isRefreshData) {
            setIsLoading(true);
          }
          // 此处重置数据, 处理请求失败, 不请求等边界情况, 后续发起请求就不用考虑这些情况
          if (typeof resetData === 'function') {
            setData(resetData(cacheRef.current.prevData));
          } else {
            setData(undefined);
          }
        } else {
          // 此处重置数据, 处理请求失败, 不请求等边界情况, 后续发起请求就不用考虑这些情况
          if (typeof resetData === 'function') {
            setData(resetData(cacheRef.current.prevData));
          }
        }
      });
    },
    []
  );

  return [
    {
      data,
      error,
      isLoading,
      hasError,
      fetchData,
    },
    dispatch,
  ] as const;
};

export { useFetch };
