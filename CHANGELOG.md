Version 1.0.0
===

- Opens async connection to URL and get response stream;
- Realized Transform stream that access response stream and gets metadata from stream;
- Realized Parser class that parse metadata received from stream into readable object;
- Automatically close connection after getting metadata from radio station;