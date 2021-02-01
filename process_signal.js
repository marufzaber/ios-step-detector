var chart;

function incrementStepCount(){
  let stepElement = document.getElementById("num-steps");
  let stepCount = parseInt(stepElement.innerHTML);
  stepElement.innerHTML = stepCount + 1;
}

function incrementEventCount(){
  let counterElement = document.getElementById("num-observed-events");
  let eventCount = parseInt(counterElement.innerHTML);
  counterElement.innerHTML = eventCount + 1;
}

function updateFieldIfNotNull(fieldName, value, precision=6){
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(precision);
}

function setupChart() {
  var ctx = document.getElementById('graph').getContext('2d');

  chart = new Chart(ctx, {
    type: 'line',
    //TODO: set up dataset configuration. You might find it useful to set lineTension to 0, otherwise the graph will interpolate between data points.
    data: {
    },
    options: {
      scales: {
        xAxes: [{
          type: 'realtime',
          pause: true
        }]
      }
    }
  });
}

function showMotionData(event) {
  updateFieldIfNotNull('Accelerometer_x', event.acceleration.x);
  updateFieldIfNotNull('Accelerometer_y', event.acceleration.y);
  updateFieldIfNotNull('Accelerometer_z', event.acceleration.z);

  updateFieldIfNotNull('Gyroscope_z', event.rotationRate.alpha);
  updateFieldIfNotNull('Gyroscope_x', event.rotationRate.beta);
  updateFieldIfNotNull('Gyroscope_y', event.rotationRate.gamma);
  incrementEventCount();

  //TODO: update chart with data

  chart.update({preservation: true});
}

function countSteps(event) {
  //TODO: count steps. You will likely need to store previous values, you can do so in an array scoped outside of this function.
  //call incrementStepCount() when a step is detected.
}

window.addEventListener('load', () => {
  setupChart();
  let is_running = false;
  let start_button = document.getElementById("start_button");
  start_button.onclick = function(e) {
    e.preventDefault();
    
    // Request permission for iOS 13+ devices
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    
    if (is_running){
      chart.options.scales.xAxes[0].realtime.pause = true;
      window.removeEventListener("devicemotion", showMotionData);
      window.removeEventListener("devicemotion", countSteps);
      start_button.innerHTML = "Start";
      is_running = false;
    } else{
      chart.options.scales.xAxes[0].realtime.pause = false;
      window.addEventListener("devicemotion", showMotionData);
      window.addEventListener("devicemotion", countSteps);
      start_button.innerHTML = "Stop";
      is_running = true;
    }
  };
});