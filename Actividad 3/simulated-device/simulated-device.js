 'use strict';

 var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
 var Message = require('azure-iot-device').Message;

 var connectionString = 'HostName=abasulto-masteriot.azure-devices.net;DeviceId=test-device;SharedAccessKey=BPtanWJh/sE0r2+z5xCTVTCZdx5ETPXO7+q8mGq7jlo=';
 var client = clientFromConnectionString(connectionString);

  function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }

 var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');
     // Create a message and send it to the IoT Hub every second
     setInterval(function(){
         // Get the current time as Unix time
         var now = new Date();
         var time = now.getTime();
         var rawTemperature = 20 + (Math.random() * 10);
         var temperature = Math.round(rawTemperature * 10) / 10;
         var rawHumidity = 10 + (Math.random() * 10);
         var humidity = Math.round(rawHumidity * 10) / 10;
         var data = JSON.stringify({ 
           deviceId: 'test-device',
           timestamp: time,
           temperature: temperature,
           humidity: humidity
         });
         var message = new Message(data);
         console.log("Sending message: " + message.getData());
         client.sendEvent(message, printResultFor('send'));
     }, 5000);
   }
 };

 client.open(connectCallback);

