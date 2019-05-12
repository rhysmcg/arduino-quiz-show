var paused = false;
var started = false;
var stopped = true;
var currentCount = 0;
var running = false;
interval = 1000;
maxCount = 20; 
var timeout;

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
 //
}

function update(item){
  document.getElementById('countdownText').textContent  = item; 
  console.log(item);
  --currentCount;
  if(currentCount < 0){
	  stop()
	  next_question(); // Go to next question
	  clearInterval(timeout);
	  }
}

function reset() {
  currentCount = maxCount;
  document.getElementById('countdownText').textContent  = currentCount; 
   clearInterval(timeout);
}

function loop(){
  if (!stopped){
    if (!paused){update(currentCount);}
    timeout = setTimeout(function(){loop()}, interval)
  }
}