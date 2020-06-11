**Instrucciones para instalar esta demo**

Estos ejercicios son una demo de como conectar una aplicación con el IoT Hub de Azure para enviar y recibir información

*Mucho de este contenido está basado en los tutoriales gratuitos de Azure. Visita el [tutorail de Azure](https://docs.microsoft.com/en-us/azure/iot-hub/quickstart-send-telemetry-node) para más información.*

---

## package.json

Archivo exclusivo de node.js donde se indican datos del proyecto así como las dependencias de librerías necesarias para hacer funcionar la aplicación

Dependencias
1. @azure/event-hubs
2. azure-iot-device
3. azure-iot-device-mqtt
4. azure-iothub

---

## Inicio de la aplicación

Antes de poder comenzar a utilizar esta aplicación se deben instalar las dependencias. Para ello, se deberá situar en la carpeta donde esté situado el archivo `package.json` y ejecutar el siguiente comando:

`npm install`

---

## register-device.js

Archivo que crea un dispositivo en el IoT Hub. Se deben dar de alta dispositivos en el IoT Hub para poder emitir información.

Para hacer que funciones este archivo se debe introducir el `IoT Hub connection string` que se encuentra en el apartado **mi iot hub | Shared access policies | iothubowner | Connection string—primary key **

---

## simulated-device.js

Archivo que simula un dispositivo IoT y que genera datos aleatorios de telemetría y los envía al IoT Hub. Para hacer funcionar este archivo necesitamos utilizar las credenciales del dispositivo que hemos creado anteriormente

Para hacer que funciones este archivo se debe introducir el `IoT Device connection string` que se encuentra en el apartado **mi iot hub | IoT devices | mi test divece | Primary Connection String**

---

## read-iot-messages.js

Archivo que se conecta al IoT Hub y lee todos los datos que se envíen a través de él. El IoT Hub emite datos a través del *Event Hub* que es otro servicio PaaS ofrecido por Azure para la emisión de datos y que está integrado en el IoT Hub

Para hacer que funciones este archivo se debe introducir el `Event Hub-compatible endpoint` que se encuentra en el apartado **mi iot hub | Built-in endpoints | Event Hub-compatible endpoint**
