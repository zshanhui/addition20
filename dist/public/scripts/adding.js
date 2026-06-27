//old version 1.2 using procedural javacript structure

	var bodyEl = document.getElementById("appBody");
	var ballsContainer = document.getElementById("balls-container");
	var ballsContainer2 = document.getElementById("balls-container2");
	var appArea = document.getElementById("app-wrapper");
	var problemDiv = document.getElementById("problem");
	var checkAnswerBtn = document.getElementById('check-answer-btn');
	var tenCorrect = 0;
	var winPoints = 0;
	function createBall() {
		ballsContainer.innerHTML = "";
		ballsContainer2.innerHTML = "";
		
		var n1 = document.getElementById("n1").value;
		var n2 = document.getElementById("n2").value;
		
		problemDiv.innerHTML = n1+" + "+n2+" = ";	
			
		for (var i=0; i<n1; i++) {
			
			var newBallLeft = document.createElement("div");
			newBallLeft.className = "balls";
			ballsContainer.appendChild( newBallLeft );
		}
		for (var j=0; j<n2; j++) {
			var newBallRight = document.createElement("div");
			newBallRight.className = "balls";
			ballsContainer2.appendChild( newBallRight );
		}
	}
	function clearBalls() {
		ballsContainer.innerHTML = "";
		ballsContainer2.innerHTML = "";
		problemDiv.innerHTML = "";
		n1.value="";
		n2.value="";
	}
	var correctAnswers;
	var studentAnswers;
	//additiion module -------------------------------------------
	function genMathProblems() {
		//var checkAnswerBtn = document.getElementById('check-answer-btn');
		//checkAnswerBtn.disabled = false;
		
		var gen1;
		var gen2;
		var	correctAdditionAnswers = [];
		var mathProblems = document.getElementById("math-problems");
		clearProblems();
		clearResults();

			for (i=0; i<10; i++) {
				gen1 = Math.floor(Math.random()*13);
				gen2 = Math.floor(Math.random()*13);
							
				var newProblem = document.createElement("li");
				newProblem.textContent= gen1 +" + "+ gen2 + " = ";
				mathProblems.appendChild(newProblem);
				
				correctAdditionAnswers.push(gen1 + gen2);
				console.log(correctAdditionAnswers);
			}
		correctAnswers = correctAdditionAnswers;
		
	}
	//subtraction module -------------------------------------------
	var correctSubtractionAnswers;
	
	function genSubtractionProblems() {
		var ranGen1;
		var ranGen2;
		var subNum1;
		var subNum2;
		var mathProblems = document.getElementById("math-problems");
			correctSubtractionAnswers = [];
		clearProblems();
		clearResults();
		
			for (i=0; i<10; i++) {
				ranGen1 = Math.floor(Math.random()*16);
				ranGen2 = Math.floor(Math.random()*9);
				subNum1 = Math.max(ranGen1, ranGen2);
				subNum2 = Math.min(ranGen1, ranGen2);
				
				var problemStr = subNum1 +" - "+ subNum2 +" = "
				var newSubProblem = document.createElement('li');
				newSubProblem.textContent = problemStr;
				mathProblems.appendChild(newSubProblem);
				//console.log(problemStr);
				
				correctSubtractionAnswers.push(subNum1 - subNum2);
				console.log(correctSubtractionAnswers);
			}
		correctAnswers = correctSubtractionAnswers;
	}
	
	//mode handler and gen problems
	function genSomeProblems() {
		var checkAnswerBtn = document.getElementById('check-answer-btn');
		checkAnswerBtn.disabled = false;
		
		var addMode = document.querySelector('#add-mode');
		var subtractMode = document.querySelector('#subtract-mode');
		var mixedMode = document.querySelector('#mixed-mode');
		
		if (addMode.checked) {
			genMathProblems();
			return;
		}
		if (subtractMode.checked) {
			genSubtractionProblems();
			return;
		}
		if (mixedMode.checked) {
			alert("mixed mode not finished yet!");
			return;
		} else {
			alert("please select a mode first!");
			return;
		}
	}
	
	//compare the students answers and correct answers to determine points
	function compareAnswers() {
		//preparing the student answers array and creating the check results container
		clearResults();
		tenCorrect = 0;
		studentAnswers = [];
		var checkResults = document.createElement('ul');
		checkResults.className = "check-results";
		appArea.appendChild(checkResults); 
		
		//getting the students answers from the 10 input fields
		for (i=0; i<10; i++) {
			var currentInput = document.getElementById("answer"+i).value;
			if (currentInput == "") {
				currentInput = -1;
			}
			studentAnswers.push(Number(currentInput));
		}
		//checking the students answers agaisnt the right answers,
		//and output the result into the results container
		for (var x=0; x<10; x++) {
			if(studentAnswers[x] === correctAnswers[x]) {
				var ifCorrect = "correct :)";
				console.log(ifCorrect);
				var result = document.createElement('li');
				result.textContent = ifCorrect;
				result.className = "correct-answer";
				checkResults.appendChild(result);
				tenCorrect++;
			} else {
				var ifWrong = ":( try # "+ (x +1) +" again";
				console.log (ifWrong);
				var result = document.createElement('li');
				result.textContent = ifWrong;
				result.className = "wrong-answer";
				checkResults.appendChild(result);
			}
		}
		//for one round win
		youWin();

		//for game win
		if (winPoints == 1) {
			//console.log("you win!");
			bodyEl.style.backgroundColor = "#ff7575";
		}
		if (winPoints == 2) {
			bodyEl.style.backgroundColor = "#ffc17f";
		}
		if (winPoints == 3) {
			document.body.innerHTML = "";
			var winText = document.createElement("h1");
			var audio = new Audio('assets/ff7-fanfare.mp3'); audio.play();
			
			winText.className = "win-text";
			winText.textContent = "You win!";
			document.body.appendChild(winText);
			bodyEl.style.backgroundColor = "#b7ff7c";
			
		} else { /*nothing, return*/ }
	}
	//attempting to set up enter key press event listener
	document.querySelector("#answer9").addEventListener('keypress', function(evt) {
		if (checkAnswerBtn.disable = false || tenCorrect !== 0 ) {
			var key = evt.which || evt.keyCode;
			if (key === 13) {
				compareAnswers();
			} else {
				console("enter does not work on ten points");
			}			
		}
	});

	function clearProblems() {
		var mathProblems = document.getElementById("math-problems");
		mathProblems.innerHTML = "";
		var allInputs = document.getElementsByTagName('input');
		for (i=0; i < allInputs.length; i++) {
			allInputs[i].value = "";
		}
	}
	function clearResults() {
		var checkResults = document.getElementsByClassName('check-results');
		for (i=0; i<checkResults.length; i++) {
			checkResults[i].innerHTML = "";
		}
	}
	// For round win function
	function youWin() {
		if (tenCorrect === 10) {
			var bodyEl = document.getElementById("appBody");
			//bodyEl.style.backgroundColor = "lightgreen";
			winPoints ++;
			var existingWinPoints = document.getElementsByClassName("win-points");
			for(i = 0; i<existingWinPoints.length; i++) {
				existingWinPoints[i].innerHTML = "";
			};
			var winPointsText = document.createElement("p");
			winPointsText.textContent = "how many times you win: "+winPoints;
			winPointsText.className = "win-points";
			document.body.appendChild(winPointsText);
			tenCorrect = 0;
			checkAnswerBtn.disabled = true;
		}
		return winPoints;	
	}