import { IFileInfo } from '../interfaces/file';
import { VALID_INFO_TYPE } from '../enums/file';

export class FileParamDto {
  readonly downloadUrl: string;
  readonly sharePwd?: string;
}

export class FolderParamDto {
  readonly baseUrl: string;
}

export class DownloadParamDto {
  readonly files: IFileInfo[];
}

export class ValidParamDto {
  readonly type: VALID_INFO_TYPE;
  readonly val: string;
}
