import { FILE_CATEGORY, VALID_INFO_TYPE } from '../enums/file';

export interface IFileParam {
  downloadUrl: string;
  // 分享链接的访问码
  sharePwd?: string;
}

export interface IFileInfo {
  category: FILE_CATEGORY;
  name: string;
  id: string;
  children: IFileInfo[];
  checked: boolean;
}

export interface IFolderParam {
  baseUrl: string;
}

export interface IFolderInfo {
  basePath: string;
  files: {
    name: string;
    isDirectory: boolean;
  }[];
}

export interface IValidInfo {
  type: VALID_INFO_TYPE;
  val: string;
}
