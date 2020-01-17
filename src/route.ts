/**
 * @file route.ts
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import {promisify} from 'util';
import fs from 'fs';
import http from 'http';
import getMime from './mime';
import config from './config';
import compress from './compress';
import isCache from './cache';
import path from 'path';

// promisify
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const route = async (req: http.IncomingMessage, res: http.ServerResponse, filePath: string) => {
    let stats;
    let notFound: boolean = true;

    const checkFile = async (urlPath: string) => {
        try {
            stats = await stat(urlPath);
            if (stats.isFile()) {
                notFound = false;
                filePath = urlPath;
                return;
            }
        }
        catch (err) {
            console.error('404了');
            res.statusCode = 404;
            res.setHeader('content-type', 'text/plain');
            res.end(`${filePath} not found!`);
            return;
        }
    };

    await checkFile(filePath);

    if (notFound && stats.isDirectory()) {
        for (const p of config.default) {
            await checkFile(path.join(filePath, p));
            if (!notFound) {
                break;
            }
        }
        if (notFound) {
            const fileNames = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('content-type', 'text/plain');
            res.end('目录包含: ' + fileNames.join(','));
            return;
        }
    }

    if (stats.isFile()) {
        res.statusCode = 200;
        const mimeType = getMime(filePath);
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
        return readStream.pipe(res);
    }
};

export default route;