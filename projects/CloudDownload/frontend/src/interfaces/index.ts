import type { FILE_CATEGORY } from '../enums';

export interface IFileInfo {
  category: FILE_CATEGORY;
  name: string;
  id: string;
  children: IFileInfo[];
  checked: boolean;
}
