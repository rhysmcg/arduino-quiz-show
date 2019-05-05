var paused = false;
var started = false;
var stopped = true;
var currentCount = 0;
var running = false;
interval = 1000;
maxCount = 20; 

function start() {
  if (stopped){
    started = true;
    paused= false;
    stopped = false;
    currentCount = maxCount;
    loop(); running = true; 
    return; 
  }
    paused= false;
}

function pause() {
  paused= true;
}
function stop(){
 paused = false;
 started = false;
 stopped = true;
 running = false;
 currentCount = 0;
}

function update(item){
  document.getElementById('countdownText').textContent  = item; 
  console.log(item);
  --currentCount;
  if(currentCount < 0){stop()}
}

function reset() {
  currentCount = maxCount;
  document.getElementById('countdownText').textContent  = currentCount; 
}

function loop(){
  if (!stopped){
    if (!paused){update(currentCount);}
    setTimeout(function(){loop()}, interval)
  }
}