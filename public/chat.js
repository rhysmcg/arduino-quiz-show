// Make connection
var socket = io();

// Query DOM
var message = document.getElementById('message');
    handle = document.getElementById('handle');
    btn = document.getElementById('send');
    output = document.getElementById('output');
    feedback = document.getElementById('feedback');
	
	// Sounds
    bgMusic = document.getElementById('bgMusic');
    btnred_sound = document.getElementById('btnred_sound');
    btnblu_sound = document.getElementById('btnblu_sound');
    btnyel_sound = document.getElementById('btnyel_sound');
    btngrn_sound = document.getElementById('btngrn_sound');

// Physical Button Codes
var btnpressed = false;

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
      message: message.value,
      handle: handle.value,
      //time: new Date().getTime()
    })
});

// Listen to keypressing
message.addEventListener('keypress', function(){
  socket.emit('typing', handle.value);
})


// Start the Show!
document.getElementById('btnPlay').onclick = function() {
	document.getElementById('intropage').style.display = 'none';
	document.getElementById('mainpage').style.display = 'block';
    animateCSS('#mainpage', 'zoomInDown')
	
	
	// Start the Timer
	var timeleft = 20;
	var downloadTimer = setInterval(function(){
	  document.getElementById('countdownText').textContent = timeleft
	  timeleft -= 1;
	  if(timeleft < 0){
		clearInterval(downloadTimer);
		document.getElementById('countdownText').textContent = "0"
	  }
	}, 1000);
	
	// Play the music
	bgmusic = document.getElementById('bg_music')
	bgmusic.parentNode.removeChild(bgmusic); // Remove it (I dunno how to stop the audio if it's embeded)
	
	document.getElementById('quiz_music').load()	
	document.getElementById('quiz_music').play()	
}

// Animate CSS Function
function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}


/* Brainstorming the rest of the ideas 

Dynamically Add content

	>> Take a look at your GITHUB page for ideas for adding questions
	>> Let's forget about randomisation for now
	>> Make a JSON file with these attributes
	>> TITLE, Opt1,opt2,opt3,opt4, time, picture // << This one is for later questions
	>> Read the JSON file and replace the text with that.

If a button has been pressed
	>> Pause the timer

	>> record who pressed first
		>> Still listen for other presses and add those into an array (reset at the next question)
		>> If yellow is second, yellow can guess the answer... if blue is third, blue can guess the answer, etc. [full points]

	>> Make a pop up with a Correct or Incorrect button (Left/or Right + Enter or press Y or N on the keyboard)
		>> Cover the answers with the pop up
		>> Collect some YES/NO sounds for these buttons
			>> If Yes, then trigger the next question
	
			>> If No, stop animating the red, and animate the next button (btn...)
			
Socket IO

	>> Make it send to a static device hosted on the web or something
	>> This will allow it to 
	
Arduino

	>> Save some Commonly used Wifi networks as variables and test each one
	>> Get shorter micro USB cables to charge it
	>> Do some research on cheap batteries and try to get some








*/








          

// Glow Button function
function glowbtn(btnname) {
    var btn = document.getElementById(btnname); // Get the current button
    animationName = btnname + ' ' + btnname + '_glow'; //Find the flashing animation glow in the css
    btn.className = animationName; // Add the flashing animation
	
    // Play the assigned button's sound
	BtnSound = eval(btnname + "_sound");
	BtnSound.load();
	//BtnSound.muted = false
	//BtnSound.play();
	
	var promise = BtnSound.play();
	if (promise) {
		//Older browsers may not return a promise, according to the MDN website
		promise.catch(function(error) { console.error(error); });
	}
	
	
	
    return false;


	// Remove Flashing Animation
    // setTimeout(function(){
        //btn.className = btnname;
     // }, 2500);
}

// Listen for events
socket.on('chat', function(data){

  console.log(btnpressed)

  // Wait for the first button to be pressed
  // Reset this for the next question
  if (btnpressed == false) {
    // Light up the buttons depending on when they're pressed

    if (data.handle == 'btnred') {
        console.log(data.handle)
        //btnpressed = true;
        glowbtn('btnred');
    }

    else if (data.handle == 'btnblu') {
        console.log(data.handle)
        //btnpressed = true;
        glowbtn('btnblu');
    }

    else if (data.handle == 'btnyel') {
        console.log(data.handle)
		//btnpressed = true;
        glowbtn('btnyel');
    }

    else if (data.handle == 'btngrn') {
        console.log(data.handle)
        //btnpressed = true;
        glowbtn('btngrn');
    }
  }

  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message
    + '</p>'
});

// Listen for the typing message
socket.on('typing', function(data) {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
})
