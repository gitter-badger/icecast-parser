var fs = require('fs'),
    path = require('path'),
    Metadata = require('./../index');

var startTime = Date.now(),
    totalRequests = 0,
    totalRequestsFailed = 0,
    totalRequestsWithMetadata = 0,
    totalRequestsWithMetadataEmpty = 0,
    totalRequestsWithoutMetadata = 0;

fs.readFile(path.resolve(__dirname, 'stations.csv'), function (error, data) {
    if (error) throw error;

    data = data.toString().split('\n');

    for (var i = 0; i < data.length; i++) {
        totalRequests++;

        var metadata = new Metadata(data[i]);
        metadata.on('metadata', function (metadata) {
            if (metadata.StreamTitle != '') {
                console.log(metadata.StreamTitle);
                totalRequestsWithMetadata++;
            } else {
                totalRequestsWithMetadataEmpty++;
            }
        });

        metadata.on('empty', function () {
            totalRequestsWithoutMetadata++;
        });

        metadata.on('error', function () {
            totalRequestsFailed++;
        });
    }
});

function exitHandler() {
    console.log('\n\nResults\n========');
    console.log('Time spent: ' + ((Date.now() - startTime) / 1000) + 's');
    console.log('Total requests: ' + totalRequests);
    console.log('Total requests without metadata (Radio station doesnt say metaint byte): ' + totalRequestsWithoutMetadata);
    console.log('Total requests with metadata (Radio station says metaint byte): ' + totalRequestsWithMetadata);
    console.log('Total requests with empty metadata (Metadata parsed but StreamTitle is totally empty): ' + totalRequestsWithMetadataEmpty);
    console.log('Total requests failed (Radio station refuse the connection): ' + totalRequestsFailed);
    process.exit();
}

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);