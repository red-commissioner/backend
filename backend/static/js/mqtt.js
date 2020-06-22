
var client;
var reconnectTimeout = 2000;
var host = location.hostname;
var port = 9001;

var tmTopic = '+/tm';
var tpTopic = 'retiro_1/gw/ui/tp';

function onConnect() {
  //Once a connection is made, make a subscription and send a message
  console.log("Connected");
  client.subscribe(tmTopic);
  client.subscribe(tpTopic);
};

function onFailure(error) {
  //Once a connection is made, make a subscription and send a message
  console.log(`[error ${error.errorCode}]: ${error.errorMessage}`);
  // setTimeout(MQTTConnect, reconnectTimeout);
};

function onMessageArrived(message) {
  console.log(`[mqtt_message] Topic: ${message.destinationName}\nPayload: ${message.payloadString}`);
  sensor = message.destinationName.split('/')[3];
  station[sensor] = message.payloadString;
}

console.log(`connecting to ${host}:${port}`);

client = new Paho.MQTT.Client(host, Number(port), "tctclient");
var options = {
  timeout: 3,
  onSuccess: onConnect,
  onFailure: onFailure,
};
client.onMessageArrived = onMessageArrived
client.connect(options);

client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: "+responseObject.errorMessage);
}


