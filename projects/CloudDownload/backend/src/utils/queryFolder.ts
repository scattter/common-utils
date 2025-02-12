import * as fs from 'fs';
import { IFolderInfo } from '../interfaces/file';

const constructFolderInfo = (path: string, files: string[]) => {
  return files
    .filter((file) => !file.startsWith('.'))
    .map((file) => {
      return {
        name: file,
        isDirectory: fs.statSync(`${path}/${file}`).isDirectory(),
      };
    });
};

export const queryFolderInfo = (path: string = '/'): Promise<IFolderInfo> => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        console.log(err);
      } else {
        if (stats.isDirectory()) {
          fs.readdir(path, (err, files) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                files: constructFolderInfo(path, files),
                basePath: path,
              });
            }
          });
        } else {
          reject('not a folder');
        }
      }
    });
  });
};
