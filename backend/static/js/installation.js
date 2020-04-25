
$('.signal').on('click', function() {
  let station = this.closest('.station');
  let topic = station.dataset['stationEscId'] + '/command';
  let payload = this.dataset['command'];
  if ('status' in this.dataset){
    payload += '=' + this.dataset['status'];
  }
  console.log(`About to send ${topic} with payload: ${payload}`);
  try {
    message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
    client.send(message);
  } catch(err) {
    // TODO: Pop up modal with error
    console.log("Something went wrong...");
  }
});