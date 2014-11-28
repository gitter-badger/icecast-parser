var http = require('http'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    Parser = require('./lib/Parser'),
    Reader = require('./lib/Reader');

util.inherits(Metadata, EventEmitter);

/**
 * Create new Metadata instance
 * @param {String|Object} options Radio station url or object with additional parameters
 * @constructor
 * @private
 */
function Metadata(options) {
    EventEmitter.call(this);

    this.setLink(options);
    this.queueRequest(0);
}

/**
 * Queue new request for update metadata
 * @param {Number} timeout Timeout for next updating in milliseconds
 * @returns {Metadata}
 * @private
 */
Metadata.prototype.queueRequest = function (timeout) {
    var self = this;

    setTimeout(function () {
        var request = http.request(self.getLink());
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
    }, timeout);

    return this;
};

/**
 * Get url from where metadata is getting
 * @returns {String} Returns radio station url
 * @private
 */
Metadata.prototype.getLink = function () {
    return this.link;
};

/**
 * Set radio station link
 * @param {String} link URL of radio station
 * @returns {Metadata}
 * @private
 */
Metadata.prototype.setLink = function (link) {
    this.link = link;
    return this;
};

module.exports = Metadata;