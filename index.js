var config = require('./config'),
    Logger = require('logger'),
    LogStream = require('log-stream'),
    Worker = require('rabbit-worker');

var logfile = new LogStream({
    fileName: 'log',
    logDir: 'logs',
    maxSize: 0x100000
}), log = new Logger('Log-Watch');

var env = process.env.NODE_ENV || 'development';
log.info('Environment: ' + env);

var cfg = config[env];
cfg.log = log;

var worker = new Worker(cfg);

[cfg.keys].forEach(doBind);

function doBind(key) {
    worker.bind(key, function (content, headers, fields) {
        var obj = {
            content: content,
            headers: headers,
            fields: fields
        };
        logfile.write(JSON.stringify(obj)+'\n');
        log.silly(obj);
    });
}
