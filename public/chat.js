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
	
	// Button Elements to be glowing
	btnred = document.getElementById('btnred');
    btnblu = document.getElementById('btnblu');
    btnyel = document.getElementById('btnyel');
    btngrn = document.getElementById('btngrn');
	
	// Question Titles and Answers (loaded dynamically)	
	questionTitle = document.getElementById('questionTitle');
	popup_title = document.getElementById('popup_title');
	opt1 = document.getElementById('opt1');
	opt2 = document.getElementById('opt2');
	opt3 = document.getElementById('opt3');
	opt4 = document.getElementById('opt4');
	

// Detecting the buttons being pressed
var btnpressed = false; 
var btnpressedorder = []

// CSS Transitions
var AnimatedCSS_Entrances = ["bounceIn","bounceInDown","bounceInLeft","bounceInRight","bounceInUp","fadeIn","fadeInDown","fadeInDownBig","fadeInLeft","fadeInLeftBig","fadeInRight","fadeInRightBig","fadeInUp","fadeInUpBig","rotateIn","rotateInDownLeft","rotateInDownRight","rotateInUpLeft","rotateInUpRight","slideInUp","slideInDown","slideInLeft","slideInRight","zoomIn","zoomInDown","zoomInLeft","zoomInRight","zoomInUp"]
var AnimatedCSS_Exits = ["bounceOut","bounceOutDown","bounceOutLeft","bounceOutRight","bounceOutUp","fadeOut","fadeOutDown","fadeOutDownBig","fadeOutLeft","fadeOutLeftBig","fadeOutRight","fadeOutRightBig","fadeOutUp","fadeOutUpBig","rotateOut","rotateOutDownLeft","rotateOutDownRight","rotateOutUpLeft","rotateOutUpRight","slideOutUp","slideOutDown","slideOutLeft","slideOutRight","zoomOut","zoomOutDown","zoomOutLeft","zoomOutRight","zoomOutUp"]

// Dynamic Pages
var currentPage = 'intropage';

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
	
	currentPage = 'mainpage';
	document.getElementById('intropage').style.display = 'none';
	document.getElementById('mainpage').style.display = 'block';
    animateCSS('#mainpage', 'zoomInDown')
	document.getElementById('button_footer').style.display = 'block';
    animateCSS('#button_footer', 'slideInUp')
	
	// Start the Timer at 20 seconds
	stop();
	reset();
	start();

	
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

///	  -------------------------------------------------- ///
///	  -------------------------------------------------- ///
///   READING QUIZ QUESTIONS AND DYNAMICALLY ADDING THEM
///	  -------------------------------------------------- ///
///	  -------------------------------------------------- ///


var quiz_data = {};
var qi = 0; 

// getJsON file from the server
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

// Read the data and save it to quiz_data


getJSON('quizzes/christmas-quiz.json', function(err, data) {

  // If it didn't load correctly
  if (err !== null) {
    alert('Something went wrong: ' + err);
	
	
  // File loaded successfully!
  // Populate the page with the first elements of the quiz
  } else {
	quiz_data = data
    qi = 0; 
	
	// Assign all the elements of the page with the data
	questionTitle.innerHTML = quiz_data.questions[qi].Question
	popup_title.innerHTML = quiz_data.questions[qi].Question
	opt1.innerHTML = quiz_data.questions[qi].Answers[0]
	opt2.innerHTML = quiz_data.questions[qi].Answers[1]
	opt3.innerHTML = quiz_data.questions[qi].Answers[2]
	opt4.innerHTML = quiz_data.questions[qi].Answers[3]
  }
});


// IF CORRECT 
// If no has been pressed, then give score to the no player...

document.getElementById('btnyes').onclick = function() {
	
	
	document.getElementById('popup-close').click();
	
	// WHO PRESSED THE Button
	console.log(btnpressedorder[0] + " pressed the button. He gets 1 Point")
	// Give Score
	
	next_question()
	

	

}

function removeBtnFlashing() {
	btnred.className = 'btnred';
	btnyel.className = 'btnyel';
	btnblu.className = 'btnblu';
	btngrn.className = 'btngrn';
}

function next_question() {
	
	// -----------------------
	// RESET all the variables
	// -----------------------
	
	
	// Stop the timer and start it again
	stop();
	reset();
	start();
	
	btnpressed = false; 
	btnpressedorder = []
	removeBtnFlashing()
	
	var currentEntrance = AnimatedCSS_Entrances[Math.floor(Math.random()*AnimatedCSS_Entrances.length)];
	
	// Remove the flashing

	// Add the next element to the quiz
    qi = qi+1; 
	
	// Check that there's still questions available	
	if (qi < quiz_data.questions.length) {
	
	// Assign all the elements of the page with the data
	questionTitle.innerHTML = quiz_data.questions[qi].Question
	popup_title.innerHTML = quiz_data.questions[qi].Question
	opt1.innerHTML = quiz_data.questions[qi].Answers[0]
	opt2.innerHTML = quiz_data.questions[qi].Answers[1]
	opt3.innerHTML = quiz_data.questions[qi].Answers[2]
	opt4.innerHTML = quiz_data.questions[qi].Answers[3]
  
  // Once finished, end the quiz
  } else {
	//alert('Quiz finished!')
	// No longer accept the buttons
	// Or simply disable the popup completely
  }
  
  	//animateCSS('#mainpage', currentExit)
	animateCSS('#mainpage', currentEntrance)
  
}





// IF INCORRECT

// Change this code for two players


document.getElementById('btnno').onclick = function() {
	
	players = btnpressedorder.length
	nextPlayer = btnpressedorder = btnpressedorder[1]

// Make sure it checks if the list exists first
	
if (players == 2) {

	alert('Next player is...' + nextPlayer)
	
	// No Score, everyone got it wrong
	} else {

	document.getElementById('popup-close').click();	
	next_question()
	
}
	
}







/* Brainstorming the rest of the ideas 

>> Add a Score Counter!

If a button has been pressed
	>> Pause the timer (Look at a basic javascript Start, Pause, Reset timer and use that instead)

	
	
Arduino

	>> Save some Commonly used Wifi networks as variables and loop through each one to test what works
	>> Get shorter micro USB cables to charge it
	>> Do some research on cheap batteries and try to get some

>> Final Quiz Screen


>> ANIAMTED Text

BIG $500!! appear in the middle of the screen (use animate CSS) and maybe a SVG animation of lightbulbs Marquee and some CHA CHING sounds would be good too.





*/


// Use this to test things
function sendBtn(btn) {
	document.getElementById('handle').innerHTML = btn
	document.getElementById('send').click()
}

          

// Glow Button function
function glowbtn(btnname) {
	btn = document.getElementById(btnname); // Get the current button
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


/*
  ____        _   _                  
 |  _ \      | | | |                 
 | |_) |_   _| |_| |_ ___  _ __  ___ 
 |  _ <| | | | __| __/ _ \| '_ \/ __|
 | |_) | |_| | |_| || (_) | | | \__ \
 |____/ \__,_|\__|\__\___/|_| |_|___/
      
  .-""-.    .-""-.    .-""-.     .-""-.
 /      \  /      \  /      \   /      \  
;   R    ;;   Y    ;;   G    ; ;   B    ;
 \      /  \      /  \      /   \      /
  '-..-'    '-..-'    '-..-'     '-..-'  
*/




// Listen for button events
socket.on('chat', function(data){
	
	// INTRO PAGE


 // console.log(btnpressed)

  // Wait for the first button to be pressed
  // Reset this for the next question
  if (btnpressed == false) {
    // Light up the buttons depending on when they're pressed

    if (data.handle == 'btnred') {
		btnpressedorder.push('btnred')
        glowbtn('btnred');
    }

    else if (data.handle == 'btnblu') {
		btnpressedorder.push('btnblu')
        glowbtn('btnblu');
    }

    else if (data.handle == 'btnyel') {
		btnpressedorder.push('btnyel')
        glowbtn('btnyel');
    }

    else if (data.handle == 'btngrn') {
		btnpressedorder.push('btngrn')
        glowbtn('btngrn');
    }
	
	console.log(data.handle)
	btnpressed = true;
	document.getElementById('popup-open').click();
	pause()
	
  // Buttons being pressed after the first one has been pressed
  // Only add to the set if it's not already there
  
  } else {
    if (data.handle == 'btnred') {
		if (btnpressedorder.indexOf('btnred') == -1) {btnpressedorder.push('btnred')}
        console.log(data.handle)
    }

    else if (data.handle == 'btnblu') {
		if (btnpressedorder.indexOf('btnblu') == -1) {btnpressedorder.push('btnblu')}
        console.log(data.handle)
    }

    else if (data.handle == 'btnyel') {
		if (btnpressedorder.indexOf('btnyel') == -1) {btnpressedorder.push('btnyel')}
        console.log(data.handle)
    }

    else if (data.handle == 'btngrn') {
		if (btnpressedorder.indexOf('btngrn') == -1) {btnpressedorder.push('btngrn')}
        console.log(data.handle)
    } 

}
console.log(btnpressedorder)
  
  // Open the Popup
  //document.getElementById('popup-open').click();
  // Pause the timer


});

// Listen for the typing message
socket.on('typing', function(data) {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
})
