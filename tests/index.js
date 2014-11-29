var fs = require('fs'),
    path = require('path'),
    Metadata = require('./../index');

fs.readFile(path.resolve(__dirname, 'stations.csv'), function (error, data) {
    if (error) throw error;

    data = data.toString().split('\n');
    for (var i = 0; i < data.length; i++) {
        var metadata = new Metadata(data[i], {
            keepListen: false,
            autoUpdate: true,
            errorInterval: 20,
            emptyInterval: 10,
            metadataInterval: 5
        });

        metadata.on('metadata', function (metadata) {
            console.log([metadata.StreamTitle, 'is playing on', this.getLink()].join(' '));
        });

        metadata.on('empty', function () {
            console.log(['Radio station', this.getLink(), 'has empty metadata'].join(' '));
        });

        metadata.on('error', function () {
            console.log(['Radio station', this.getLink(), 'has reject connection'].join(' '));
        });
    }
});