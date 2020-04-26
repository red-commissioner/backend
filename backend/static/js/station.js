
var station = $('h1').data()['stationId'];

$(".command").on('click', function(){
  let payload = "0";
  let is_off = this.dataset['status'] == "0";
  if (is_off) {
    payload = "1";
  }

  let topic = station + '/gw/ui/tc/' + this.dataset['command'];
  console.log(`About to send ${topic} with payload: ${payload}`);

  try {
    message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
    client.send(message);

    let jq_this = $(this);
    let status_color_cls = `btn-${this.dataset['statusColor']}`;

    if (is_off){
      //on
      jq_this.removeClass('btn-light');
      jq_this.addClass(status_color_cls);
    } else {
      // off
      jq_this.removeClass(status_color_cls);
      jq_this.addClass('btn-light');
    }

    this.dataset['status'] = payload;
  } catch(err) {
    // TODO: Pop up modal with error
    console.log(`Something went wrong... ${err}`);
  }

});