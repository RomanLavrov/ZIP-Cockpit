require('./bootstrap');
console.log("Google Charts Loaded");

$(document).ready(function () {

    var temperatureDiv = document.getElementById("temperatureGraph");
    var humidityDiv = document.getElementById('humidityGraph');
    var rawSensorsData = JSON.parse(document.getElementById('Climat').dataset.climat);

    var sensorsData = [];

    var sensors = Object.keys(rawSensorsData);
    sensors.forEach(sensor => {
        var Sensor = new Object();
        Sensor.Location = sensor;
        Sensor.Temperature = rawSensorsData[sensor].temperature;
        Sensor.Humidity = rawSensorsData[sensor].humidity;
        Sensor.Occupancy = rawSensorsData[sensor].occupancy;

        sensorsData.push(Sensor);
    });


    google.charts.load("current", {
        packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(drawTemperatureChart);
    google.charts.setOnLoadCallback(drawHumidityChart);

    function getRandColor() {
       var colorArray = [
             '#3E91E2',
             '#508EDD',
             '#668AD7',
             '#7E85D0',
             '#8483CD',
             '#9281C9',
             '#A07EC5',
             '#A67CC2',
             '#C477BA',
             '#E76FAE'
       ];

        return colorArray[Math.round(Math.random()*10)];
    }

    var options = {
      
      legend: {
          position: 'none',
          fontName: 'Arial'
      }
  };

    function drawTemperatureChart() {
        var temperatureDataArray = [];
        var header = ['Raum', 'Temperature', {
            role: "style"
        }];
        temperatureDataArray.push(header);
        sensorsData.forEach(element => {
            temperatureDataArray.push([element.Location, element.Temperature, getRandColor()]);
        });

        var data = google.visualization.arrayToDataTable(temperatureDataArray);
       
        var chart = new google.visualization.ColumnChart(temperatureDiv);
        chart.draw(data, options);
    }

    function drawHumidityChart() {
      
      var humidityDataArray = [];
        var header = ['Raum', 'Humidity', {
            role: "style"
        }];
        humidityDataArray.push(header);
        sensorsData.forEach(element => {          
            humidityDataArray.push([element.Location, element.Humidity, getRandColor()]);
        });

        
        var data = google.visualization.arrayToDataTable(humidityDataArray);
        var chart = new google.visualization.ColumnChart(humidityDiv);
        chart.draw(data, options);
    }

})
