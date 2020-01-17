/**
 * @file compress.ts
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import zlib from 'zlib';
import http from 'http';
import fs from 'fs';

export default (
    readStream: fs.ReadStream,
    req: http.IncomingMessage,
    res: http.ServerResponse
): any => {
    const acceptEncoding = req.headers['accept-encoding'] + '';
    let result: any = readStream;
    if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip');
        result = readStream.pipe(zlib.createGzip());
    }
    else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate');
        result = readStream.pipe(zlib.createDeflate());
    }

    return result;
};
