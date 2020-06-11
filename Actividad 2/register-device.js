 'use strict';

 var iothub = require('azure-iothub');

 var connectionString = 'HostName=abasulto-masteriot.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=wAawP4U4KiWVHbZwjMtqAQhTIw/a83vTbi31KJ/WMiM=';

 var registry = iothub.Registry.fromConnectionString(connectionString);

 var device = new iothub.Device(null);
 device.deviceId = 'test-device';
 registry.create(device, function(err, deviceInfo, res) {
   if (err) {
     registry.get(device.deviceId, printDeviceInfo);
   }
   if (deviceInfo) {
     printDeviceInfo(err, deviceInfo, res)
   }
 });

 function printDeviceInfo(err, deviceInfo, res) {
   if (deviceInfo) {
     console.log(deviceInfo);
     console.log('Device ID: ' + deviceInfo.deviceId);
     console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
   }
 }
