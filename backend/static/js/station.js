
const all_status = Object.keys(status);
for (let s of all_status) {
  aux = [...all_status];
  console.log(aux);
  status[s]['other_status'] = aux;
}

var current_status = $('.text[data-station-status]');
var station_color = current_status.parent();
var station_icon = station_color.find('i');
var other_status_container = $('a[data-status]');

function set_status() {

  selected_status = current_status.data()['stationStatus'];
  icon = status[selected_status]['icon'];
  color = status[selected_status]['color'];
  other_status = status[selected_status]['other_status'];

  current_status.text(selected_status);

  station_icon.removeClass()
  station_icon.addClass("fal fa-lg text-gray-300 fa-" + icon);
  
  for (let i=0; i<other_status.length; i++){
    other_status_container[i].dataset['status'] = other_status[i];
    other_status_container[i].text = other_status[i];
  }

  station_color.removeClass();
  station_color.addClass('btn btn-icon-split btn-' + color)
}

set_status()

$('a.dropdown-item').on('click', function(){

  current_status.data()['stationStatus'] = this.dataset['status'];

  let station = $('h1').data()['stationId'];
  let topic = station + '/command';
  let payload = 'status=' + this.dataset['status'];
  console.log(`About to send ${topic} with payload: ${payload}`);

  try {
    message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
    client.send(message);
    set_status();
  } catch(err) {
    // TODO: Pop up modal with error
    console.log("Something went wrong...");
  }

});