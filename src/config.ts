/**
 * @file config.ts 默认启动项
 * @author afcfzf <9301462@qq.com>
 * @date 2020-01-17
 */

export type Config = {
    root: string
    host: string
    port: number;
    compress: string[],
    index: string[],
    cache: {
        maxAge: number,
        expires: boolean,
        cacheControl: boolean,
        lastModified: boolean,
        etag: boolean
    },

    mimeTypes: {
        [name: string]: string
    }
};

// 配置
const config: Config = {
    // 根目录，相对于启动脚本路径
    root: 'wwwroot',

    // host
    host: '127.0.0.1',

    // 端口
    port: 8123,

    // 压缩
    compress: ['html', 'js', 'css', 'md'],

    // 默认主页
    index: ['index.html', 'index.htm'],

    // 默认缓存
    cache: {
        maxAge: 2,
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
    },

    // mime类型
    mimeTypes: {
      'js': 'application/x-javascript',
      'html': 'text/html',
      'css': 'text/css',
      'txt': "text/plain",
      'png': "image/png",
      'jpg': "image/jpeg",
      'jpeg': "image/jpeg",
      'md': "application/octet-stream",
    }
};

export default config;
