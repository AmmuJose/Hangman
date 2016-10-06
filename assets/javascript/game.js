// global variables
var winCount = 0;
var loseCount = 0;
 

// hangman Object
var hangman = {
	words: ['Hippopotamus', 
			'Armadillo', 
			'Porcupine', 
			'Peacock', 
			'Alligator', 
			'Elephant', 
			'Antelope',
			'Pronghorn',
			'Penguin'],	
	letters: ['A', 'B', 'C', 'D', 'E','F',
				'G', 'H', 'I', 'J', 'K', 'L',
				'M', 'N', 'O', 'P', 'Q', 'R',
				'S', 'T', 'U', 'V', 'W', 'X',
				'Y', 'Z'],
	lives: 10,
	userInputs: [],
	matchedLettersCount: 0,
	computerWord: "",
	computerWordLength: 0,
	userInput: "",
	wordWithMatchedLetters: "",
	gameOver: false,

	// initalies hangman properties
	init: function() {
		this.gameOver = false;
		this.lives = 10;
		this.userInputs = [];
		this.matchedLettersCount = 0;
		this.computerWord = this.guessAWord();
		this.computerWordLength = this.calculateWordLength();
		this.userInput = "";
		this.wordWithMatchedLetters = "";

		var initialWordToPrint = this.createInitialWordToPrint();
		this.printWord(initialWordToPrint);
	
		// set elements
		document.querySelector("#userInputs").innerHTML = "";
		document.querySelector("#lives").innerHTML = this.lives;
		document.querySelector("#winCount").innerHTML = winCount;	
		document.querySelector("#loseCount").innerHTML = loseCount;	
		document.querySelector("#hangman-img").src = 'assets/images/animals.png';	
	},

	// proceed to hangman rules if user input is an alphabet
	startGmae: function() {
		if(this.gameOver === false && this.isAlphabet()) {
			this.checkRules();			
		}
	},

	// validate against game rules
	checkRules: function() {
		if(! this.checkInputAlreadyTried()) { // if letter is not tried

			this.disableLetterBtn();
			this.pushToTriedValues(); // array for tried values
			this.printUserTriedInputs(); // prit user input

			if(! this.checkWordContainsUserInput()){ // if user entered letter is not in the word

				this.printLivesLeft();
				this.showHangmanImage(); 
				this.winLoseCountAndAudioOnGameEnd(); //if lives zero set audio and winCount				
				this.startNewOnGameOver();

			}else{ // if user entered letter is in the word

				this.createWordWithMatchedLetters();
				this.winLoseCountAndAudioOnGameEnd(); // if user answer is correct
				this.startNewOnGameOver();
				document.querySelector("#word").innerHTML = this.wordWithMatchedLetters;
			}
		}
	},

	// generate word randomly	
	guessAWord: function() {
		var computerRandomNumber = Math.floor(Math.random() * this.words.length);
		return this.words[computerRandomNumber];
		console.log(this.computerWord);
	},

	//calculate word length
	calculateWordLength: function() {		
		return this.computerWord.length;
	},

	// create string with all dashes to print on initial load
	createInitialWordToPrint: function() {
		var word = "";
		for (var i = 0; i < this.computerWordLength; i++) {
			word += '_ '; 
		}
		this.wordWithMatchedLetters = word;
		return word;
	},
	
	// check to see if user already tried the input
	checkInputAlreadyTried: function() {
		if(this.userInputs.length !== 0){
			var result = this.userInputs.indexOf(this.userInput) < 0 ? false:true;
			return result;
		}else{
			return false;
		}
	},

	// array for tried values
	pushToTriedValues: function() {
		this.userInputs.push(this.userInput);
	},

	//check if input is a letter
	isAlphabet: function(){
		var pattern = /[a-z]/i;
		return this.userInput.match(pattern);
	},
	
	//check if word contains the letter user entered
	checkWordContainsUserInput: function() {
		var contains = false;
		for (var i = 0; i < this.computerWordLength; i++) {
			if(this.computerWord.charAt(i).toUpperCase() == this.userInput) {
				contains = true;
			}
		}
		return contains;
	},

	//replace dashes with letters
	createWordWithMatchedLetters: function() {
		for (var i = 0; i < this.computerWordLength; i++) {				
			if(this.computerWord.charAt(i).toUpperCase() == this.userInput) {
				if(i === 0){
					this.wordWithMatchedLetters = this.wordWithMatchedLetters.substring(0, i*2) + 
												this.userInput.toUpperCase() + this.wordWithMatchedLetters.substring((i*2+1));
				}else{
					this.wordWithMatchedLetters = this.wordWithMatchedLetters.substring(0, i*2) + 
												this.userInput.toLowerCase() + this.wordWithMatchedLetters.substring((i*2+1));
				}				
				this.matchedLettersCount++;
			}
		}
	},

	// print word
	printWord: function(word) {
		document.querySelector("#word").innerHTML = word;
	},

	// print user tried letters
	printUserTriedInputs: function() {
		var triedInputs = "";

		for(var i =0; i < this.userInputs.length; i++) {
			triedInputs += " " + hangman.userInputs[i] + " ";
		}
		document.querySelector("#userInputs").innerHTML = triedInputs;
	},

	// print number of lives left
	printLivesLeft: function() {
		this.lives--;
		document.querySelector("#lives").innerHTML = this.lives;
	},

	// increment win/lose count by one and play audio 
	winLoseCountAndAudioOnGameEnd: function() {
		if(this.lives === 0) {
			loseCount++;
			this.playAudio('assets/sounds/gameLost.mp3');
			document.querySelector("#hangman-img").src = "assets/images/animals.png";	
			this.gameOver = true;
		}

		if(this.matchedLettersCount == this.computerWordLength){
			winCount++;
			this.playAudio('assets/sounds/gameWon.mp3');
			this.gameOver = true;
		}
	},

	// starts new game
	startNewOnGameOver: function() {
		if(this.gameOver === true){
			for (var i = 0; i < this.letters.length; i++) {
				var id = "#li-"+this.letters[i];
				document.querySelector(id).className = "liActive";
			};
			this.init();
		}
	},

	// play audio
	playAudio: function(gameAudio) {
		var audio = new Audio(gameAudio);
		audio.play();
		audio.volume = .5;
	},

	// shows hangman images
	showHangmanImage: function() {
		if(this.lives != 10){
			document.querySelector("#hangman-img").src  = "assets/images/hangman-"+ (9-this.lives) +".png";
		}else{
			document.querySelector("#hangman-img").src  = "assets/images/animals.png";
		}
	}, 

	// when user clicks letter Buttons 
	letterClick: function(letter){
		this.userInput = letter.toUpperCase();
		this.disableLetterBtn();		
		this.startGmae();
	},

	// disables letters that user has entered
	disableLetterBtn: function() {
		var id = "#li-"+ this.userInput;
		document.querySelector(id).className = "liDisabled"
	},

}


// event listener
window.onload = function(event) {	

	// add letter buttons
	var html = "<ul>";
		for (var i = 0; i < hangman.letters.length; i++) {
			html += '<li id="li-'+hangman.letters[i]+'" class="liActive"';
			html += 'onclick="hangman.letterClick(\''+ hangman.letters[i]+'\')">';
			html +=  hangman.letters[i] + "</li>";
		};
		html += "</ul>";		
	document.querySelector("#letterBtn").innerHTML = html;

	hangman.init();	
	
	document.onkeyup = function(e) {
		hangman.userInput = String.fromCharCode(e.keyCode).toUpperCase();
		hangman.startGmae();
	}

	
	



}//End window onload


