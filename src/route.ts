/**
 * @file route.ts
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import {promisify} from 'util';
import fs from 'fs';
import http from 'http';
import mime from './mime';
import config from './config';
import compress from './compress';
import isCache from './cache';

// promisify
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const route = async (req: http.IncomingMessage, res: http.ServerResponse, filePath: string) => {
    try {
        const stats = await stat(filePath);
        const {isFile, isDirectory} = stats;
        const mimeType = mime[filePath];
        if (isFile()) {
            res.statusCode = 200;
            res.setHeader('content-type', mimeType);
            if (isCache(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }

            let readStream = fs.createReadStream(filePath);
            if (filePath.match(config.compress)) {
                readStream = compress(readStream, req, res);
            }
            readStream.pipe(res);
        }
        else if (isDirectory()) {
            const fileNames = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('content-type', mimeType);
            res.end('目录包含: ' + fileNames.join(','));
        }
    }
    catch (err) {
        console.error(err);
        res.statusCode = 404;
        res.setHeader('content-type', 'text/plain');
        res.end(`${filePath} not found!`);
    }
};

export default route;