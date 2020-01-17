/**
 * @file config.ts 默认启动项
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

export default {
    root: process.cwd(),
    host: '127.0.0.1',
    port: 8123,
    compress: /\.(html|js|css|md)/,
    cache: {
        maxAge: 2,
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
    }
};
