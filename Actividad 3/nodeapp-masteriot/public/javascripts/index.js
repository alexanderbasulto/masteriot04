$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature & Humidity Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  $.ajax({
    url: "/readings",
    context: document.body
  }).done(function(result) {
    result.forEach(function(element) {
      var temperature = Math.round(element.temperature * 100) / 100;
      var humidity = Math.round(element.humidity * 100) / 100;
      var deviceId = element.deviceId;
      var time = new Date(element.timestamp*1).toUTCString();
      $('table tbody').append('<tr><td>'+deviceId+'</td><td>'+temperature+'</td><td>'+humidity+'</td><td>'+time+'</td></tr>');
    });
  });

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var socket = io.connect(location.host);
  console.log('Socket connected');
  socket.on('message', function (data) {
    console.log('receive message : ' + data);
    try {
      var obj = JSON.parse(data);

      if(!obj.timestamp || !obj.temperature) {
        return;
      }
      var time = new Date(obj.timestamp*1).toUTCString();
      timeData.push(time);
      temperatureData.push(obj.temperature);

      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  });
});
