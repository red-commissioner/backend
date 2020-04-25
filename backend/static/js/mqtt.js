
var client;
var reconnectTimeout = 2000;
var host = location.hostname;
var port = 9001;
var subscribeTopic = '#';

function onConnect() {
  //Once a connection is made, make a subscription and send a message
  console.log("Connected");
  client.subscribe(subscribeTopic);
};

function onFailure(error) {
  //Once a connection is made, make a subscription and send a message
  console.log(`[error ${error.errorCode}]: ${error.errorMessage}`);
  // setTimeout(MQTTConnect, reconnectTimeout);
};

function onMessageArrived(message) {
  console.log(`[mqtt_message] Topic: ${message.destinationName}\nPayload: ${message.payloadString}`);
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


