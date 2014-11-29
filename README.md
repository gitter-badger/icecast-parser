icecast-parser
====

NodeJS module for getting and parsing metadata from SHOUTcast/Icecast radio streams

Features
====
- Metadata parses as object with key-value;
- Getting metadata from stream realized in Transform stream, so you can pipe output to another Writeable stream;
- Opens an async connection to URL and gets response with radio stream and metadata. Then pipe this response to Transform stream;
- Once metadata was recieved event `metadata` is triggers with parsed metadata object in listener;
- You can subscribe also to `empty` event that means that connection was successful but metadata is empty. And `error` event which means that connection to radio station was refused;
- After getting metatdata connection is closing automatically, so you don't spent a lot of traffic;
- Autoupdating metadata from radiostation by interval in economy way (opens connection only when it's really need);
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
    console.log(metadata.StreamTitle);
});
```

Configuration
===

You can provide additional parameters to constructor:

- `autoUpdate` - by default `false`. If you set to `true` then metadata will be updating with interval and notify you about new metadata;
- `errorInterval` - by default `300` s. You can provide interval in seconds when next try will be executed if connection was refused or rejected. Works only if `autoUpdate` is enabled.
- `emptyInterval` - by default `180` s. You can provide interval in seconds when next try will be executed if metadata was empty. Works only if `autoUpdate` is enabled.
- `metadataInterval` - by default `10` s. You can provide interval in seconds when will be next updating of metadata. Works only if `autoUpdate` is enabled.

```javascript
var Metadata = require('icecast-parser');

var metadata = new Metadata('http://streaming.radionomy.com/HammerHeadRadio', {
    autoUpdate: true,
    errorInterval: 5 * 60,
    emptyInterval: 3 * 60,
    metadataInterval: 10
});

metadata.on('metadata', function(metadata) {
    console.log('Here you will receive metadata each 10 seconds');
    console.log(metadata.StreamTitle);
});
```

Events
===

You can subscribe to 3 events - `error`, `empty`, `metadata`.

- `error` event triggers when connection to radio station was refused, rejected or timed out;
- `empty` event triggers when connection was established successful, but radio station returns empty metadata;
- `metadata` event triggers when connection was esablished successful and metadata was parsed.

```javascript
var Metadata = require('icecast-parser');

var metadata = new Metadata('http://streaming.radionomy.com/HammerHeadRadio');

metadata.on('metadata', function(metadata) {
    console.log(metadata.StreamTitle);
});

metadata.on('empty', function() {
    console.log(['Radio station', this.getLink(), 'doesn\'t have metadata'].join(' '));
});

metadata.on('error', function() {
    console.log(['Connection to', this.getLink(), 'was rejected'].join(' '));
});
```