export interface IFileChunk {
  file: Blob;
  fileName: string;
  chunkName: string;
  index: number;
}