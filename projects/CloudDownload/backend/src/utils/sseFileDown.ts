import axios, { AxiosError, AxiosProgressEvent } from 'axios';
import * as fs from 'fs';

export const handleDownload = async (
  url: string,
  path: string,
  cb?: (progressEvent: AxiosProgressEvent) => void,
) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: '*/*',
      },
      responseType: 'stream',
      onDownloadProgress: function (progressEvent_2) {
        // 回调: 通知调用方下载的进度
        cb?.(progressEvent_2);
      },
    });
    const { headers } = response;
    console.log('开始下载');
    const date = new Date();
    const matches = headers['content-disposition']?.match(/filename=(.*)/);
    const fileName = matches
      ? decodeURIComponent(matches[1])
      : `"${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}"`;
    const writer = fs.createWriteStream(
      `${path}/${fileName.substring(1, fileName.length - 1)}`,
    );
    // 将响应数据流式传输到文件
    response.data.pipe(writer);
    // 当数据传输完成时，关闭可写流
    response.data.on('end', function () {
      writer.end();
      console.log(`数据已经成功传输到文件中`);
      return Promise.resolve('');
    });
  } catch (error) {
    const { status, statusText } = error.response;
    console.log('下载失败');
    throw `下载出现错误, ${status}: ${statusText}`;
  }
};
