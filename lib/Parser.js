/**
 * Create new parser
 * @param {Buffer|String} metadata
 * @constructor
 * @private
 */
function Parser(metadata) {
    this.setMetadata(metadata);
}

/**
 * Get current metadata
 * @returns {String}
 */
Parser.prototype.getMetadata = function () {
    return this.metadata;
};

/**
 * Set new metadata to parser
 * @param {Buffer|String} metadata
 * @returns {Parser}
 */
Parser.prototype.setMetadata = function (metadata) {
    this.metadata = Buffer.isBuffer(metadata) ? metadata.toString('utf8') : metadata;
    return this;
};

/**
 * Parse metadata and get object
 * @returns {Object}
 */
Parser.prototype.parse = function () {
    var data = this.getMetadata().replace(/\0*$/, '').split(';'),
        result = {},
        item;

    for (var i = 0; i < data.length; i++) {
        item = data[i];

        if (item.length > 0) {
            item = item.split(/\=['"]/);
            result[item[0]] = String(item[1]).replace(/['"]$/, '');
        }
    }

    return result;
};

module.exports = Parser;