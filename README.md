icecast-parser
====

NodeJS module for getting and parsing metadata from SHOUTcast/Icecast radio streams

Features
====
- Metadata parses as object with key-value;
- Getting metadata from stream realized in Transform stream, so you can pipe output to another Writeable stream;
- Opens an async connection to URL and gets response with radio stream and metadata. Then pipe this response to Transform stream;
- Once metadata was recieved event `metadata` is triggers with parsed metadata object in listener;
- After getting metatdata, connection is closing automatically.

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