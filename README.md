icecast-parser
====

NodeJS module for getting and parsing metadata from SHOUTcast/Icecast radio streams

Features
====
- Opens async connection to URL and gets response with radio stream and metadata. Then pipes response to Transform stream for processing;
- Getting metadata from stream is realized in Transform stream, so you can pipe radio station stream to another Writeable\Duplex\Transform stream;
- Once metadata is recieved, `metadata` event triggers with metadata object;
- After metadata is received, connection to radio station closes automatically, so you will not spent a lot of traffic;
- But you can set `keepListen` flag in config object and continue listening radio station;
- Autoupdating metadata from radiostation by interval in economical way (connection is opens when time has come);
- Metadata parsed as object with key-value;
- When you create new instance, you get EventEmitter. So you can subscribe to other events;
- Easy to configure and use.

Getting started
====

You can install icecast-parser from npm.
```shell
npm install icecast-parser
```

Get your first metadata from radio station.
```javascript
var Metadata = require('icecast-parser');

var metadata = new Metadata('http://streaming.radionomy.com/HammerHeadRadio');
metadata.on('metadata', function(metadata) {
    console.log([metadata.StreamTitle, 'is playing on', this.getLink()].join(' '));
});
```

Configuration
===

You can provide additional parameters to constructor:

- `keepListen` - by default `false`. If you set to `true`, then response from radio station is not destroys and you can pipe it to another streams.
- `autoUpdate` - by default `false`. If you set to `true`, then metadata will be updates with interval and notifies you about new metadata;
- `errorInterval` - by default `300` s. You can set interval in seconds when next try will be executed if connection was refused or rejected. Works only if `autoUpdate` is enabled.
- `emptyInterval` - by default `180` s. You can set interval in seconds when next try will be executed if metadata is empty. Works only if `autoUpdate` is enabled.
- `metadataInterval` - by default `10` s. You can set interval in seconds when will be next update of metadata. Works only if `autoUpdate` is enabled.

```javascript
var Metadata = require('icecast-parser');

var metadata = new Metadata('http://streaming.radionomy.com/HammerHeadRadio', {
    keepListen: false, // don't listen radio station after metadata was received
    autoUpdate: true, // update metadata after interval
    errorInterval: 5 * 60, // retry connection after 5 minutes
    emptyInterval: 3 * 60, // retry get metadata after 3 minutes
    metadataInterval: 10 // update metadata after 10 seconds
});

metadata.on('metadata', function(metadata) {
    console.log('Here you will receive metadata each 10 seconds');
    console.log(metadata.StreamTitle);
});
```

Events
===

You can subscribe to 4 events - `error`, `empty`, `metadata`, `stream`.

- `error` event triggers when connection to radio station was refused, rejected or timed out;
- `empty` event triggers when connection was established successful, but radio station returns empty metadata;
- `metadata` event triggers when connection was established successful and metadata is parsed successful;
- `stream` event triggers when response from radio station returned and successfully piped to Transform stream.

```javascript
var Metadata = require('icecast-parser');

var metadata = new Metadata('http://streaming.radionomy.com/HammerHeadRadio', {
    keepListen: true
});

metadata.on('error', function() {
    console.log(['Connection to', this.getLink(), 'was rejected'].join(' '));
});

metadata.on('empty', function() {
    console.log(['Radio station', this.getLink(), 'doesn\'t have metadata'].join(' '));
});

metadata.on('metadata', function(metadata) {
    console.log(metadata.StreamTitle);
});

metadata.on('stream', function(stream) {
    stream.pipe(process.stdout);
});
```

License
===

The MIT License (MIT)

Copyright (c) 2014 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.