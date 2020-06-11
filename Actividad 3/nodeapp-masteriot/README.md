# Node App Master IoT
This NodeJS backEnd connects with azure IoT service in order to receive data from all sensors.

The backend also opens a websocket connection thanks to socket.io library. This will be consumed by the angular client. Every time a sensors reading is received, the backend will store the data in a mongodb collection and send it out through the websocket connection.

This backend also runs a REST API. The code to serve the methods is palced at server.js

Finally, there is a public folder with a realtime chart that loads information received through the IoT hub or aynchronous information through the REST API.

## License
[MIT](LICENSE.txt) license.

