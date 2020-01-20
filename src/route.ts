/**
 * @file route.ts
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import {promisify} from 'util';
import fs from 'fs';
import http from 'http';
import getMime from './mime';
import {Config} from './config';
import compress from './compress';
import isCache from './cache';
import path from 'path';

// promisify
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

export = class Router {
    config: Config = null;

    constructor(conf: Config) {
        this.config = conf;
    }

    async route(req: http.IncomingMessage, res: http.ServerResponse, filePath: string) {
        let stats;

        try {
            stats = await stat(filePath);
        }
        catch (err) {
            console.error('404了');
            res.statusCode = 404;
            res.setHeader('content-type', 'text/plain');
            res.end(`${filePath} not found!`);
            return true;
        }

        if (stats.isDirectory()) {
            let notFound = true;
            for (const p of this.config.index) {
                try {
                    filePath = path.join(filePath, p);
                    stats = await stat(filePath);
                    if (stats.isFile()) {
                        notFound = false;
                        break;
                    }
                }
                catch (err) {
                    // 无路径
                }
            }
            if (notFound) {
                const fileNames = await readdir(filePath);
                res.statusCode = 200;
                res.setHeader('content-type', 'text/plain; charset=utf-8');
                res.end('目录包含: ' + fileNames.join(','));
                return;
            }
        }

        if (stats.isFile()) {
            res.statusCode = 200;
            const mimeType = getMime(this.config.mimeTypes, filePath);
            res.setHeader('content-type', mimeType);
            if (isCache(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }

            let readStream = fs.createReadStream(filePath);
            const reCmpr = new RegExp(`\\.(${(this.config.compress as string[]).join('|')})`);
            if (filePath.match(reCmpr)) {
                readStream = compress(readStream, req, res);
            }
            return readStream.pipe(res);
        }
    }
}
