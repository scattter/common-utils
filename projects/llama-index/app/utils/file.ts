import {DEFAULT_FILE_SPLIT_SIZE} from "@/app/const";
import {IFileChunk} from "@/app/interface/file";
import axios from "axios";

export const createSplitFormDataList = (file: File, size = DEFAULT_FILE_SPLIT_SIZE) => {
  const { name } = file
  const chunkList: IFileChunk[] = []
  let cur = 0
  while (cur * size < file.size) {
    chunkList.push({ file: file.slice(cur * size, (cur + 1) * size), fileName:name, chunkName: `${name}-${cur}`, index: cur })
    cur++
  }
  return chunkList.map(chunk => {
    const { chunkName, fileName, index, file } = chunk
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('chunkName', chunkName)
    return { formData, index }
  })
}

export const uploadSplitFile = (formData: FormData) => {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:3000/api/upload', formData).then(res => resolve(res)).catch(err => reject(err))
  })
}

export const mergeSplitFile = (fileName: string) => {
  axios.post('http://localhost:3000/api/upload/merge', { fileName }).then()
}

// 处理批量请求
export async function parallel<T>(
  jobs: T[],
  fn: (params: T) => Promise<any>,
  limit = 2,
  successBack: (args: (Promise<any> | undefined)[]) => void = () => {}
) {
  const ret: (Promise<any> | undefined)[] = [];

  let cursor = 0;
  async function worker() {
    let currentJob;
    while (cursor < jobs.length) {
      try {
        currentJob = cursor;
        cursor += 1;
        await fn(jobs[currentJob])
          .then((res) => ret.push(res))
          .catch((e) => ret.push(e))
          .finally(() => successBack(ret));
      } catch (e: any) {
        throw new Error(e?.message ?? '请重试');
      }
    }
  }

  const workers = [];

  for (let i = 0; i < limit && i < jobs.length; i += 1) {
    workers.push(worker());
  }

  await Promise.allSettled(workers);

  return Promise.resolve(ret);
}
