/**
 * @file server.ts
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import http from 'http';
import path from 'path';
import config from './config';
import route from './route';

const server = http.createServer((req, res) => {
    console.log('req.url', req.url);
    const filePath = path.join(config.root, req.url);
    route(req, res, filePath);
});

server.listen(
    config.port,
    config.host,
    () => console.info(`server started at http://${config.host}:${config.port}`)
);