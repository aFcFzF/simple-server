/**
 * @file server.ts
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

import http from 'http';
import path from 'path';
import conf, {Config} from './config';
import Router from './route';

export = class Server {
    conf: Config = null;
    server: http.Server;
    router;

    constructor(config = {}) {
        this.conf = Object.assign(conf, config);
        this.router = new Router(this.conf);
        this.createServer();
    }

    createServer() {
        const config = this.conf;
        const server = this.server = http.createServer((req, res) => {
            const root = req.url.charAt(0) === '/' ? config.root : path.join(process.cwd(), config.root);
            const filePath = path.join(root, req.url);
            this.router.route(req, res, filePath);
        });

        server.listen(
            config.port,
            config.host,
            () => console.info(`server started at http://${config.host}:${config.port}`)
        );
    }
}
