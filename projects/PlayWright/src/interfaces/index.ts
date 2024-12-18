export interface IFileInfo {
  type: 'folder' | 'file';
  name: string;
  id: string;
  children: IFileInfo[];
  checked: boolean;
}