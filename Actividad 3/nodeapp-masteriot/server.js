/**
 * Import Libraries
 */
// Node.js libraries
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var socketIO = require('socket.io');
var path = require('path');

// Azure libraries
var EventHubClient = require('azure-event-hubs').Client;
var iothub = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

// Project files
var Reading = require('./models/reading');
var readingController = require('./controllers/reading');

/**
 * Declare variables
 */
var mongo_string = process.env.MONGO_STRING || 'mongodb://masteriot:lC1G5HJd7F76zYXuqzM7supd9YfUXk4buTPqq5YE1Fxmc1ScrgIGsMNBDJPzCzGqyDsSAUEWnGLL4KvF3bYGgA==iotdb@masteriot.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@masteriot@';
var connectionString = process.env.CONNECTION_STRING || 'HostName=abasulto-masteriot.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=wAawP4U4KiWVHbZwjMtqAQhTIw/a83vTbi31KJ/WMiM=';
var port = process.env.PORT || 3000;
var targetDevice = 'test-device';

/**
 * Connect to MongoDB
 */
mongoose.connect(mongo_string, {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;

/**
 * Create API & WebSocket
 */
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader("Accept", "application/json");
  // Pass to next layer of middleware
  next();
});

/**
 * Rest routes
 */
app.get('/test', function(req, res) {
  res.send("Welcome to the server. You can receive last measures going to /readings.");
});

app.get('/readings', readingController.getReadings);

/**
 * Public http
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res/*, next*/) {
  res.redirect('/');
});

/**
 * Functions
 */
function handleError(err) {
  console.log(err.message);
};

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

function handleMessage(message) {
  var stringifyMessage = JSON.stringify(message.body);

  console.log('Message received: ');
  console.log(stringifyMessage);
  console.log('');

  saveReading(message.body)

  emitReading(stringifyMessage);

  sendMessageToDevice(message.body.temperature);
}

function saveReading(message) {
  var reading = new Reading();
  
  reading.deviceId = message.deviceId;
  reading.timestamp = message.timestamp;
  reading.temperature = message.temperature;
  reading.humidity = message.humidity;
  
  reading.save(function(err) {
    if (err) console.log('An error has occured');
    else console.log('Reading added to the database');
    console.log('');    
  });  
}

function emitReading(message) {
  io.emit('message', message);
  console.log('Message sent to WebSocket');
  console.log('');
}

var sendMessageToDevice = function (temperature) {
  var message = new Message("");
  message.ack = 'full';
  message.messageId = "everis";

  if (temperature > 22) message.data = 'off';
  else if (temperature <= 22) message.data = 'on';

  console.log('Temperature:', temperature);
  console.log('Sending message to Device: ' + message.getData());
  console.log('');

  serviceClient.send(targetDevice, message, printResultFor('send'));
};

/**
 * Open Servers
 */
 // Checking socket
 io.on('connection', function (socket) {
   console.log('Connected Socket');
 });
 console.log('');
 console.log('======================');
 console.log('== SERVER LAUNCHED ==');
 console.log('======================');
 console.log('Socket server listening on port ' + port);
 console.log('');

 // Http server started
 server.listen(port, function () {
  console.log('');
  console.log('======================');
  console.log('== SERVER LAUNCHED ==');
  console.log('======================');
  console.log('Rest server listening on port ' + port);
  console.log('');
});

// Open Azure IoT Hub connection and listen to it
var client = EventHubClient.fromConnectionString(connectionString);
client.open()
  .then(client.getPartitionIds.bind(client))
  .then(function (partitionIds) {
    console.log('');    
    console.log('=========================');
    console.log('== CONNECTED TO AZURE ==');
    console.log('=========================');
    console.log('Ready to RECEIVE data from devices');
    console.log('');    
    return partitionIds.map(function (partitionId) {
      return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
        console.log('Created partition receiver: ' + partitionId);
        receiver.on('errorReceived', handleError);
        receiver.on('message', handleMessage);
      });
    });
  })
  .catch(handleError);

// Open Azure IoT Hub connection and send messages to it
var serviceClient = iothub.fromConnectionString(connectionString);
serviceClient.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('');    
    console.log('=========================');
    console.log('== CONNECTED TO AZURE ==');
    console.log('=========================');
    console.log('Ready to SEND messages to devices');    
    console.log('');
  }
});
