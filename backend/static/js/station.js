
var station = {
  name: $('h1').data()['stationId'],
}

var max_tmp = 100;

var primary_temp = $("#tp");
var primary_temp_indicator = primary_temp.find(".h3");

var deposit_temp = $("#tm");
var deposit_temp_indicator = deposit_temp.find(".h5");
var deposit_temp_bar = deposit_temp.find(".progress-bar");

Object.defineProperties(station, {
  tm: {
    get: function() {
      return station._tm;
    },
    set: function(new_value) {
      station._tm = new_value;
      deposit_temp_indicator.text(station._tm + "º C");

      //add new bg class according to new temperature
      deposit_temp_bar.toggleClass("bg-danger", parseInt(new_value) > max_tmp/3);
      deposit_temp_bar.attr('aria-valuenow', new_value).css('width', new_value+'%');;
    }
  },
  tp: {
    get: function() {
      return station._tp;
    },
    set: function(new_value) {
      station._tp = new_value;
      primary_temp_indicator.text(station._tp + "º C");
    }
  }
})

$(".command").on('click', function(){
  let payload = "0";
  let is_off = this.dataset['status'] == "0";
  if (is_off) {
    payload = "1";
  }

  let topic = station.name + '/gw/ui/tc/' + this.dataset['command'];
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