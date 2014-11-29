var http = require('http'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    Parser = require('./lib/Parser'),
    Reader = require('./lib/Reader');

util.inherits(Metadata, EventEmitter);

/**
 * Create new Metadata instance
 * @param {String} url Radio station url
 * @param {Object} config Object with additional parameters
 * @constructor
 * @private
 */
function Metadata(url, config) {
    EventEmitter.call(this);

    this.setLink(url);
    this.setConfig(config);
    this.queueRequest(0);
}

/**
 * Start processing request to radio station and grab metadata
 * @returns {Metadata}
 * @private
 */
Metadata.prototype._executeRequest = function () {
    // TODO: clean up
    var queueRequest = function (timeout) {
        if (this.getConfig('autoUpdate')) {
            this.queueRequest(timeout);
        }
    }.bind(this);

    var self = this,
        request = http.request(self.getLink());

    request.setHeader('Icy-MetaData', '1');
    request.once('response', function (response) {
        var metaint = response.headers['icy-metaint'];

        if (metaint) {
            var reader = new Reader(metaint);
            reader.on('metadata', function (metadata) {
                queueRequest(self.getConfig('metadataInterval'));
                self.emit('metadata', new Parser(metadata).parse());
                response.destroy();
            });
            response.pipe(reader);
        } else {
            queueRequest(self.getConfig('emptyInterval'));
            self.emit('empty');
            response.destroy();
        }
    });

    request.once('error', function (error) {
        queueRequest(self.getConfig('errorInterval'));
        self.emit('error', error);
    });

    request.end();

    return this;
};

/**
 * Queue new request for update metadata
 * @param {Number} timeout Timeout for next updating in seconds
 * @returns {Metadata}
 * @private
 */
Metadata.prototype.queueRequest = function (timeout) {
    setTimeout(this._executeRequest.bind(this), timeout * 1000);
    return this;
};

/**
 * Get url from where metadata is getting
 * @returns {String} Returns radio station url
 */
Metadata.prototype.getLink = function () {
    return this._link;
};

/**
 * Set radio station link
 * @param {String} link URL of radio station
 * @returns {Metadata}
 * @private
 */
Metadata.prototype.setLink = function (link) {
    this._link = link;
    return this;
};

/**
 * Get configuration object or value of specified key
 * @param {String} [key] Specify key if you want get specified option
 * @returns {Object|*} Returns all object of options or value of specified key
 */
Metadata.prototype.getConfig = function (key) {
    if (key) {
        return this._config[key];
    } else {
        return this._config;
    }
};

/**
 * Set configuration object
 * @param {Object} config
 * @returns {Metadata}
 */
Metadata.prototype.setConfig = function (config) {
    config = config || {};

    this._config = {
        autoUpdate: typeof config.autoUpdate === 'boolean' ? config.autoUpdate : false,
        errorInterval: config.errorInterval || 5 * 60,
        emptyInterval: config.emptyInterval || 3 * 60,
        metadataInterval: config.metadataInterval || 10
    };

    return this;
};

module.exports = Metadata;