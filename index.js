var http = require('http'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    Parser = require('./lib/Parser'),
    Reader = require('./lib/Reader');

util.inherits(Metadata, EventEmitter);

/**
 * Create new Metadata instance
 * @param {String} url Radio station url from where need retrieve metadata
 * @constructor
 * @private
 */
function Metadata(url) {
    var self = this,
        request;

    EventEmitter.call(self);
    self.setUrl(url);

    request = http.request(self.getUrl());
    request.setHeader('Icy-MetaData', '1');

    request.once('response', function (response) {
        var metaint = response.headers['icy-metaint'];

        if (metaint) {
            var reader = new Reader(metaint);
            reader.on('metadata', function (metadata) {
                self.emit('metadata', new Parser(metadata).parse());
                response.destroy();
            });
            response.pipe(reader);
        } else {
            self.emit('empty');
            response.destroy();
        }
    });

    request.once('error', function (error) {
        self.emit('error', error);
    });

    request.end();
}

/**
 * Get url from where metadata is getting
 * @returns {String} Returns url
 */
Metadata.prototype.getUrl = function () {
    return this.url;
};

/**
 * Set url
 * @param {String} url
 * @returns {Metadata}
 */
Metadata.prototype.setUrl = function (url) {
    this.url = url;
    return this;
};

module.exports = Metadata;