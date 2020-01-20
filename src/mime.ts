/**
 * @file mime.ts
 *
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import path from 'path';

export default (mimeTypes, filePath: string) => {
    let ext = path.extname(filePath)
        .split('.').pop().toLowerCase() // 取扩展名

    if (!ext) { // 如果没有扩展名，例如是文件
        ext = filePath;
    }

    return mimeTypes[ext] || mimeTypes.txt;
}
