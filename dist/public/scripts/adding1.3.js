/* Basic Math HTML App version 1.3.js
## Updating to use modern design patterns such as object literal pattern / modular design pattern
## Better, cleaner organized code for readability
## Now added _underscore ultility library
## Changed variable and function names for better readability
##
## Adding mix add and subtract problems mode
## Adding ability to draw subtraction hint balls
## Adding text marking of the balls for better counting
## Adding instant hint for drawing modules for each problem
## Better game ending module overlaying the draw area
## 
*/

//Module for adding the balls
var MathDrawModule = {
	defineDom: function() {
		this.appBody = document.getElementById("appBody");

		this.ballInputOne = document.getElementById("ball-input1"),
		this.ballInputTwo = document.getElementById("ball-input2"),

		this.ballsContainerOne = document.getElementById("balls-container"),
		this.ballsContainerTwo = document.getElementById("balls-container2"),

		this.createBallBtn = document.getElementById("create-ball-btn"),
		this.clearBallBtn = document.getElementById("clear-ball-btn"),

		this.problemText = document.getElementById("problem");

		this.addMode = document.querySelector('#add-mode');
		this.subtractMode = document.querySelector('#subtract-mode');
		this.mixedMode = document.querySelector('#mixed-mode');
	},
	init: function() {
		this.defineDom();
		this.eventBinding();
		//this.renderAddBalls();

	},
	eventBinding: function() {
		this.createBallBtn.addEventListener("click", this.renderBalls.bind(this)); //might need to bind "this" later
		this.clearBallBtn.addEventListener("click", this.clearBalls.bind(this));
		
	},
	renderBalls: function(fromHint1, fromHint2, hintSign) {
		this.ballsContainerOne.innerHTML = "";
		this.ballsContainerTwo.innerHTML = "";
		numOneVal = parseInt(this.ballInputOne.value, 10) || fromHint1;
		numTwoVal = parseInt(this.ballInputTwo.value, 10) || fromHint2;

		if(this.addMode.checked) {
			if((numOneVal < 21) && (numTwoVal < 21)) {
				this.renderAddBalls();
			}
			else {
				alert('both numbers must be under 21');
			}
		}
		if(this.subtractMode.checked) {
			//execute only if first number if greater than second number and not over 31
			if((numOneVal&&numTwoVal < 41) && numOneVal >= numTwoVal) {

				this.renderSubBalls();
			}
			else if(numOneVal || numTwoVal === 0) {
				this.renderSubBalls();
			}
			else {
				alert("value can not be over 40.");
			}
		}
		if(this.mixedMode.checked) {
			alert("Please use subtract or add mode for help module");
		}

	},
	renderAddBalls: function() {
		//tweaking addition ball styles
		this.ballsContainerOne.style.width = "110px";
		this.ballsContainerOne.style.border = "2px dashed green";
		this.ballsContainerOne.style.display = "inline-block";

		this.ballsContainerTwo.style.width = "110px";
		this.ballsContainerTwo.style.left = "700px";
		this.ballsContainerTwo.style.display = "inline-block";
		this.problemText.textContent= numOneVal+ " + "+ numTwoVal+ " = ";
		this.problemText.style.color= "green";

		//output correct calculation for the addition balls
		for (var i=0; i<numOneVal; i++) {
			var newBallLeft = document.createElement("div");
			//writes the number inside the balls
			newBallLeft.textContent= i+1;
			newBallLeft.className = "balls";
			this.ballsContainerOne.appendChild( newBallLeft );
		}
		for (var j=0; j<numTwoVal; j++) {
			var newBallRight = document.createElement("div");
			//writes the number inside the balls
			newBallRight.textContent = parseInt(numOneVal) + j + 1;
			newBallRight.className = "balls";
			this.ballsContainerTwo.appendChild( newBallRight );
		}

	},
	renderSubBalls: function() {
		this.ballsContainerOne.style.width = "250px";
		this.ballsContainerOne.style.border = "2px dashed red";
		this.ballsContainerTwo.style.display = "none";
		this.problemText.textContent= numOneVal+ " - "+ numTwoVal+ " = ";
		this.problemText.style.color= "red";

		for (var ii=0; ii<(numOneVal - numTwoVal); ii++) {
			var newBallLeft = document.createElement("div");
			newBallLeft.textContent= ii+1;
			newBallLeft.className = "balls";
			this.ballsContainerOne.appendChild( newBallLeft );
		}
		for (var jj=0; jj<numTwoVal; jj++) {
			var newBallRight = document.createElement("div");
			newBallRight.textContent= ii+1+jj;
			newBallRight.className = "balls";
			newBallRight.style.backgroundColor = "#F00";
			newBallRight.style.opacity = ".15";
			this.ballsContainerOne.appendChild( newBallRight );
		}

	},
	clearBalls: function() {
		this.ballsContainerOne.innerHTML = "";
		this.ballsContainerTwo.innerHTML = "";
		this.problemText.innerHTML = "";
		this.ballInputOne.value="";
		this.ballInputTwo.value="";
	}
};
//initiates the init method of the MathDrawModule
MathDrawModule.init();


//Module responsible for generating the math problems to solve
MathProblemsModule = {
	theCorrectAnswers: [],
	theStudentAnswers: [],
	questionsCorrect: 0,
	roundsWon: 0,

	defineDom: function() {
		this.appBody = document.getElementById("appBody");
		this.winModule = document.getElementById("win-module");

		this.makeProblemsBtn = document.getElementById("problems-btn"),
		this.checkAnswersBtn = document.getElementById("check-answer-btn"),

		this.userAnswerFields = document.getElementsByClassName("user-answer");
		this.problemsArea = document.getElementById('math-problems');
		//mode element selectors
		this.addMode = document.querySelector('#add-mode');
		this.subtractMode = document.querySelector('#subtract-mode');
		this.mixedMode = document.querySelector('#mixed-mode');
		//hint area element selectors
		this.plusSign = document.getElementById('plus-sign');
		this.bigSign = document.getElementById('big-plus');

		this.allHints = document.getElementsByClassName("hint");
		//this.mathProblems = document.querySelectorAll('#math-problems li');
	},
	init: function() {
		this.defineDom();
		this.eventBinding();
	},
	eventBinding: function() {
		this.makeProblemsBtn.addEventListener('click', this.genMathProblems.bind(this));
		this.checkAnswersBtn.addEventListener('click', this.checkAnswers.bind(this));

		//bind event to all the hints press
		for(var i =0; i<this.allHints.length; i++) {
			this.allHints[i].addEventListener('click', this.hintSystems.bind(this));
		}
		
	},
	hintSystems: function(event) {

		//extracting the hint id from the clicked element
		console.log(event.target.id);
		var hintId = event.target.id;
		hintId = parseInt(hintId.substring(5,4));

		//extracting the relevant two numbers and sign from the problem string
		var insideStr = document.querySelectorAll('#math-problems li')[hintId].textContent;
		console.log(insideStr);
		var parts = insideStr.split(" ");
		var hintNum1 = parts[0],
			hintNum2 = parts[2],
			hintSign = parts[1];
		
		//Use the MathDraw Module to render the balls passing in the new parameters
		MathDrawModule.clearBalls();
		MathDrawModule.renderBalls(hintNum1, hintNum2, hintSign);

	},
	//generates a set of math problems depending on mode selected
	genMathProblems: function() {
		this.checkAnswersBtn.disabled = false; //because the checkAnswersBtn is disable after winning a round
		//the hint box just stacks on top of eachother, should fix this...
		if( this.addMode.checked ) { 
			this.additionProblems(); 
			return; 

		}
		else if( this.subtractMode.checked ) { 
			this.subtractionProblems(); 
			return; }


		else if( this.mixedMode.checked) { this.mixedProblems(); return; }
	},

	// if the addtion problems mode is checked
	additionProblems: function() {
		//console.log("giving you addition problems");
		var randNum1, randNum2, problemStr; 
		var correctAnswers = [];
		//need to clear problems and result here
		this.clearProblems();

		for(var i = 0; i < 10; i++) {
			randNum1 = Math.floor(Math.random()*13);
			randNum2 = Math.floor(Math.random()*13);

			problemStr = randNum1+ " + "+ randNum2 + " = ";
			//console.log(problemStr);
			var newAddProblem = document.createElement("li");
			newAddProblem.textContent = problemStr;
			this.problemsArea.appendChild(newAddProblem);

			//push the correct answers into array
			correctAnswers.push(randNum1 + randNum2); //console.log(correctAnswers);
		}
		this.theCorrectAnswers = correctAnswers;
	},
	// if the subtractions problems mode is checked
	subtractionProblems: function() {
		//console.log("giving you subtraction problems");
		var randNum1, randNum2, subNum1, subNum2, problemStr; 
		var correctAnswers = [];
		//clearing the problems area, and results here
		this.clearProblems();

		for (var i = 0; i < 10; i++) {
			randNum1 = Math.floor(Math.random()*21);
			randNum2 = Math.floor(Math.random()*11);
			subNum1 = Math.max(randNum1, randNum2);
			subNum2 = Math.min(randNum1, randNum2);
			
			problemStr = subNum1 +" - "+ subNum2 +" = ";
			var newSubProblem = document.createElement('li');
				newSubProblem.textContent = problemStr;
			this.problemsArea.appendChild(newSubProblem);
			//console.log(problemStr);
			
			correctAnswers.push(subNum1 - subNum2); //console.log(correctAnswers);
		}
		this.theCorrectAnswers = correctAnswers;
	},
	// if the mixed problems mode is checked
	mixedProblems: function() {
		console.log("giving you mixed problems"); 
		//declaring needed variables
		var randNum1, randNum2, subNum1, subNum2, problemStr;
		var correctAnswers = [];
		//clear this input fields and results here
		this.clearProblems();

		//repeated five times for each kind of problem
		for(var k = 0; k < 5; k++) {

			//part one for the addition problem strings
			randNum1 = Math.floor(Math.random()*13);
			randNum2 = Math.floor(Math.random()*13);

			problemStr = randNum1+ " + "+ randNum2+ " = ";
			var newAddProblem = document.createElement('li');
				newAddProblem.textContent = problemStr;
			this.problemsArea.appendChild(newAddProblem);

			correctAnswers.push(randNum1 + randNum2);

			//part two for the subtraction problem strings
			randNum1 = Math.floor(Math.random()*21);
			randNum2 = Math.floor(Math.random()*11);
			subNum1 = Math.max(randNum1, randNum2);
			subNum2 = Math.min(randNum1, randNum2);

			problemStr = subNum1+ " - "+ subNum2+ " = ";
			var newSubProblem = document.createElement('li');
				newSubProblem.textContent = problemStr;
			this.problemsArea.appendChild(newSubProblem);

			correctAnswers.push(subNum1 - subNum2);
		}
		this.theCorrectAnswers = correctAnswers; console.log(this.theCorrectAnswers);
	},
	//method for displaying the results check box
	createResultsBox: function() {
		//console.log("creating results box");


		this.checkResults = document.createElement('ul');
		this.checkResults.className = "check-results check-results-box";
		document.getElementById('app-wrapper').appendChild(this.checkResults); 
	},
	checkAnswers: function() {
		//clear the results here and reset some things
		this.questionsCorrect = 0;
		this.theStudentAnswers = [];
		//append the results text box to the app body
		this.createResultsBox();

		//grabbing the user entered answers from the input fields
		for (i=0; i<10; i++) {
			var currentInput = document.getElementById("answer"+i).value;
			if (currentInput == "") {
				currentInput = -1;
			}
			this.theStudentAnswers.push(Number(currentInput));
		}

		//start logic for comparing students answers to correct answers
		for(var i=0; i<10; i++) {
			if( this.theCorrectAnswers[i] === this.theStudentAnswers[i] ) {
				//console.log(i + 1 +" is correct");
				var correctStr = "ok :-)";
				var resultLine = document.createElement('li');
					resultLine.textContent= correctStr;
					resultLine.className= "correct-answer";
				this.checkResults.appendChild(resultLine);
				//changing the style of the input fields
				var currentUserAnswer = document.getElementsByClassName('user-answer')[i];
				currentUserAnswer.style.border= "none";
				currentUserAnswer.style.borderBottom= "2px solid #555";

				this.questionsCorrect = this.questionsCorrect + 1; //console.log(this.questionsCorrect);
			}
			else {
				//console.log(i + 1 +" is wrong");
				var wrongStr = "try again";
				var resultLine = document.createElement('li');
				resultLine.textContent = wrongStr;
				resultLine.className = "wrong-answer";
				this.checkResults.appendChild(resultLine);
				//changing the style of the input fields
				var currentUserAnswer = document.getElementsByClassName('user-answer')[i];
				currentUserAnswer.style.border= "1px solid red";
			}
		} //finish for-loop for comparing answers

		//scoring functions
		this.roundIncrement();
		this.gameOver();
	},
	roundIncrement: function() {
		//Procedure for mananging scoring system afte answers right
		if( this.questionsCorrect === 10 ) {
			this.roundsWon = this.roundsWon + 1;
			//console.log(this.questionsCorrect);
			//console.log(this.roundsWon);

			//update points text on page
			var pointsText = document.createElement("p");
			pointsText.textContent = "";
			pointsText.id = "win-points";
			document.body.appendChild(pointsText);
			document.getElementById('win-points').innerHTML= this.roundsWon;

			this.questionsCorrect = 0;

			//disables the check answer button so user can not get addition points from pressing multiple times
			this.checkAnswersBtn.disabled = true;
		}

	},
	gameOver: function() {
		//Procedure for game winning conditions
		if(this.roundsWon === 1) {
			console.log("round 1 passed");
			this.appBody.style.background="linear-gradient(45deg, #E6ADB8, #1578E2)";
		}
		if(this.roundsWon === 2) {
			console.log("round 2 passed");
			this.appBody.style.background="linear-gradient(45deg, salmon, lightyellow)";
		}
		if(this.roundsWon === 3) {
			console.log("round 3 passed");
			//do something special below
			var title = document.createElement('h3');
				title.className= "win-title";
				title.innerHTML= "Nice work! You completed all the math problems for today.<br />Now let's watch some excavator videos.";
			var link = document.createElement('a');
				link.className= "win-link";
				link.href= "https://www.youtube.com/results?search_query=excavator";
				link.innerHTML= "to youtube";
			var resetText = document.createElement('p');
				resetText.innerHTML= "or refresh the page to practice some more maths";
				resetText.className= "reset-text";

			this.winModule.appendChild(title);
			this.winModule.appendChild(link);
			this.winModule.appendChild(resetText);
			this.winModule.style.display= "block";

			var pointsText = document.getElementById('win-points');
				pointsText.style.right= "550px";

		}
		else {
			//do nothing
			return;
		}

	},
	keyBoardEventListener: function() {
		//enter key should activate check answer event function
		//will add some keyboard events in the future

	},
	clearProblems: function() {
		this.problemsArea.innerHTML = "";
		for(var i = 0; i < this.userAnswerFields.length; i++) {
			this.userAnswerFields[i].value = "";
		}
	},
	clearResults: function() {
		//might now this in the future
	}


};

MathProblemsModule.init();

//MathScore Module
//MathScoreModule = {};
