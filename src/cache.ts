/**
 * @file cache.ts
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import config from './config';
import fs from 'fs';
import http from 'http';

const refreshRes = (stats, res) => {
    const {maxAge, expires, cacheControl, lastModified, etag} = config.cache;

    if (expires) {
        res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
    }
    if (cacheControl) {
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    }
    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString());
    }
    if (etag) {
        res.setHeader('ETag', `${stats.size}-${stats.mtime.toUTCString()}`);
    }
}

export default (stats: fs.Stats, req: http.IncomingMessage, res: http.ServerResponse) => {
    refreshRes(stats, res);

    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if (!lastModified && !etag) {
        return false;
    }
    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false;
    }
    if (etag && etag !== res.getHeader('ETag')) {
        return false;
    }

    return true;
};