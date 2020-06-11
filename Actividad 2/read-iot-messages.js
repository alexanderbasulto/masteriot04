const { EventHubConsumerClient } = require("@azure/event-hubs");

const connectionString = 'Endpoint=sb://ihsuprodblres091dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=wAawP4U4KiWVHbZwjMtqAQhTIw/a83vTbi31KJ/WMiM=;EntityPath=iothub-ehub-abasulto-m-3431418-22fba023a9';
var printError = function (err) {
  console.log(err.message);
};

var printMessages = function (messages) {
  for (const message of messages) {
    console.log("Telemetry received: ");
    console.log(JSON.stringify(message.body));
    console.log("Properties (set by device): ");
    console.log(JSON.stringify(message.properties));
    console.log("System properties (set by IoT Hub): ");
    console.log(JSON.stringify(message.systemProperties));
    console.log("");
  }
};

async function main() {
  console.log("IoT Hub Quickstarts - Read device to cloud messages.");
  const clientOptions = {};

  const consumerClient = new EventHubConsumerClient("$Default", connectionString, clientOptions);

  consumerClient.subscribe({
    processEvents: printMessages,
    processError: printError,
  });
}

main().catch((error) => {
  console.error("Error running sample:", error);
});
