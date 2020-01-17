/**
 * @file mime.ts
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import path from 'path';

type MimeType = {
    [name: string]: string
};

const mimeTypes: MimeType = {
  'js': 'application/x-javascript',
  'html': 'text/html',
  'css': 'text/css',
  'txt': "text/plain",
  'png': "image/png",
  'jpg': "image/jpeg",
  'jpeg': "image/jpeg"
}

export default (filePath: string): string => {
  let ext = path.extname(filePath)
    .split('.').pop().toLowerCase() // 取扩展名

  if (!ext) { // 如果没有扩展名，例如是文件
    ext = filePath
  }

  return mimeTypes[ext] || mimeTypes.txt;
}