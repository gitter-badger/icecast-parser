Version 1.1.0
===

- Small improvements in code style;
- Realized queuing of requests;
- Implemented auto updating of metadata in economy mode;
- Added configuration object where you can set intervals for auto update (error, empty, metadata);

Version 1.0.0
===

- Opens async connection to URL and get response stream;
- Realized Transform stream that access response stream and gets metadata from stream;
- Realized Parser class that parse metadata received from stream into readable object;
- Automatically close connection after getting metadata from radio station;