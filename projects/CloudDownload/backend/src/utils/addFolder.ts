import * as fs from 'fs';

/**
 * 新建文件夹
 * @param dirPath 文件夹路径
 * @returns 返回创建结果（成功或失败）
 */
export function createFolder(dirPath: string) {
  try {
    // 检查文件夹是否已存在
    if (!fs.existsSync(dirPath)) {
      // 创建文件夹
      fs.mkdirSync(dirPath, { recursive: true });
      return { isSuccess: true, message: '创建成功' };
    } else {
      return { isSuccess: false, message: `文件夹已存在` };
    }
  } catch {
    return { isSuccess: false, message: `文件夹创建失败` };
  }
}
