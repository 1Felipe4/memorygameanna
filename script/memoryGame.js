var allNames = []

var setAllNames = function(){
	for (let i = 1; i <= 28; i++) {
		allNames.push(i + "")
		
	}
}


function card(name, pos = null){
	this.name = name.charAt(0).toUpperCase() + name.toLowerCase().substring(1);
	this.img = document.createElement("img");
	this.state = "Turned Down";
	this.flipped = false;
	this.element = document.createElement("div");

	this.init = function(){
		let element = this.element
		
		element.setAttribute("class", "card");
		element.style.margin = "2px";
		element.style.padding = "5px";
		let img = this.img;
		img.setAttribute("src", "images/mystery.png");
				
		img.style.width = "80%";
		element.appendChild(img);	
		element.style.textAlign = "center";
		element.style.borderRadius = "1em";
		img.style.opacity = "1";

	
	
	}

	this.changeState = function (state){
		console.log(state)
		if(this.state != "Matched"){
			this.state = state;
		}

	}

	this.render = function(){
		let element = this.element
		let img = this.img;
		this.flipped = true;
	
		switch (this.state.toLowerCase()) {
			case "matched":
				element.style.outline = "3px solid green";
				break;
			case "selected":
				element.style.outline = "3px solid gold";
				break;
			case "bad select":
				element.style.outline = "3px solid red";
				break;		
			case "turned down":
				this.flipped = false;
				element.style.outline = "";
				break;	
		
			default:
				element.style.outline = "";
				console.log("switch failed")
				break;
		}

		if(this.flipped){
			img.setAttribute("src", "images/AnnaBanana/"+ name + ".png");
		}else{
			img.setAttribute("src", "images/mystery.png");
		}
	}


	this.pos = function(row = this.row, col = this.col){
		this.row = row;
		this.col = col;

		return this.row, this.col;
	}

	this.testMatch = function (card){
		if(this.name == card.name){
			this.matched = true;
			card.matched = true;

			
			return true;
		}
		
		return false;
	}




}



function scoreboard(){
	this.games = [];
	this.matches = document.createElement("div");
	this.guesses = document.createElement("div");
	this.timer;
	this.data = $("<div> </div>")


	this.gamelist = document.createElement("div");
	this.fastest = document.createElement("div");
	this.leastGuesses = document.createElement("div");

	this.init = function (){
		let div = document.createElement("div");
		div.style.margin = "10% 0";
		div.style.fontSize = ".8em";
		let header = document.createElement("h1");
		header.style.fontSize = ".8em";
		header.style.margin = "0 auto"
		header.style.gridArea = "header";
		header.innerHTML = "<u>Scoreboard</u>";
		header.style.padding = ".2em 0"
		let fastest = this.fastest;
		fastest.style.gridArea = "fastest";

		let leastGuesses = this.leastGuesses;
		leastGuesses.style.gridArea = "leastGuesses";

		let games = this.gamelist;
		games.style.gridArea = "games";

		div.appendChild(header);
		div.appendChild(games);
		$(div).append(this.data)
		div.appendChild(leastGuesses);
		div.appendChild(fastest);
		
		let right = document.getElementById("rightSide");
		right.innerHTML = "";
		right.appendChild(div); 

	}
	//xmlns:xlink="http://www.w3.org/1999/xlink"
	//aria-labelledby:"title",
	this.getData = function(){
		let games = [];
		this.games.forEach(game => {

			if(game.secs){
				games.push(game)
			}

		})

		if(games.length<2){
			return;
		}

		let chart = $(document.createElementNS('http://www.w3.org/2000/svg', "svg")).attr({
			version: "1.2",
		 	class:"graph",
			role:"img"})
		chart.attr('xmlns:xlink', "http://www.w3.org/1999/xlink");			
		chart.attr('aria-labelledby', "title");			

		let headerRow = $("<dt> Guesses and Seconds </dt>");
		let title = $(document.createElementNS('http://www.w3.org/2000/svg', "title")).html("Games and Guesses");
		title.attr("id", "title")
		chart.append(title)
		let xGrid = $(document.createElementNS('http://www.w3.org/2000/svg', "g")).attr({
			class:"grid x-grid", 
			id:"xGrid"})

		let yGrid = $(document.createElementNS('http://www.w3.org/2000/svg', "g")).attr({
				class:"grid y-grid", 
				id:"yGrid"})

		let xLine = $(document.createElementNS('http://www.w3.org/2000/svg', "line")).attr({
			x1:"90",
			x2:"90",
			y1:"5",
			y2:"401"})

		let yLine = $(document.createElementNS('http://www.w3.org/2000/svg', "line")).attr({
			x1:"90",
			x2:"615",
			y1:"400",
			y2:"400"})

		let xGridLines = svg("g").attr({
			class:"grid x-grid"})
		let yGridLines = svg("g").attr({
			class:"grid y-grid"})

		let scatterDataSet = svg("g").attr({
				class:"data",
				"data-setname": "Our first data set"})

		let pLine = svg("polyline").attr({	
     	fill:"none",
     	stroke:"#0074d9",
     	"stroke-width":"3"
		})
				

		xGrid.append(xLine)
		yGrid.append(yLine)
		chart.append(xGrid)
		chart.append(yGrid)
		chart.append(xGridLines)
		chart.append(yGridLines)
		chart.append(pLine)
		chart.append(scatterDataSet) 
		
		let xLabels = $(document.createElementNS('http://www.w3.org/2000/svg', "g")).attr({
			class:"labels x-labels"})
		let yLabels = $(document.createElementNS('http://www.w3.org/2000/svg', "g")).attr({
				class:"labels y-labels"})

		


		var maxGuess = 0;
		this.games.forEach(game =>{
			if(game.guesses){
			maxGuess = Math.max(maxGuess, game.guesses);
			}
			
		})

		maxGuess++;

		let guessInterval = this.gridInterval(maxGuess);
		let gameInterval = this.gridInterval(games.length);

		console.log(guessInterval)
		let yScaleInterval = Math.ceil((400) / (maxGuess/guessInterval));
		let xScaleInterval = Math.ceil((715-90) / (games.length/gameInterval))
		console.log(xScaleInterval);
		console.log(xScaleInterval)
		yLines = []
		yTexts = [];
		for (let i = 5, g = 0; i < 400; i+= yScaleInterval, g+=guessInterval) {
			console.log(i);
			let text = $(document.createElementNS('http://www.w3.org/2000/svg', "text")).attr({
				x:"80"})
 
			let line = svg("line").attr({
				x1:"90",
				x2:"705"})
			
			line.attr("y1", i + "");
			line.attr("y2", i + "");
			text.attr("y", i + "");
			text.html(g)
			yTexts.push(text)

			yLines.push(line);
			yLabels.append(text)
			yGridLines.append(line)
			
		}
		yLabelTitle = $(document.createElementNS('http://www.w3.org/2000/svg', "text")).attr({
			x:"50",
			y:"200",
			class:"label-title"})
		yLabelTitle.html("Guess");
		yLabels.append(yLabelTitle)
		xCount = 1;
		let points = ""
		//let x = 90;
		for (let i = 0,x = 90; i < games.length; x+= xScaleInterval,  i+= gameInterval) {
			let data = svg("circle").attr("r", 4);
			game = games[i];

			let multiplier = game.guesses/maxGuess;

			let y = Math.ceil(multiplier*400) +5
			if(i == 0){
				yLine.attr("x1", x + "")
				yLines.forEach(l => {
					l.attr("x1", x + "")
				});

				yTexts.forEach(t => {
					t.attr("x", (x - 10) +"")
				});
				xLine.attr({
					x1: x +"",
					x2: x + ""
				})
			}else if(i == games.length - 1){
				yLine.attr("x2", x + "")
				yLines.forEach(l => {
					l.attr("x2", x + "")
					console.log(x)
				});
			}
			data.attr("cx",  x + "");
			data.attr("cy",  y + "");
			points += " " + x +  "," + y
			let line = svg("line").attr({
				y1:"5",
				y2:"401"})
			line.attr("x1", (x) + "");
			line.attr("x2", (x) + "");
			let text = $(document.createElementNS('http://www.w3.org/2000/svg', "text")).attr({
				y:"430"})
			text.attr("x", (x) + "");
			
			text.html(game.name)
			xLabels.append(text)
			xGridLines.append(line)
			scatterDataSet.append(data)
			
		}

		// games.forEach(game => {
		
			
		// 	let data = svg("circle").attr("r", 4);
			

		// 	let multiplier = game.guesses/maxGuess;
		// 	let xMultiplier = xCount/games.length;

		// 	let y = (multiplier*400)
			
		// 	if(xCount == 1){
		// 		yLine.attr("x1", x + "")
		// 		yLines.forEach(l => {
		// 			l.attr("x1", x + "")
		// 		});

		// 		yTexts.forEach(t => {
		// 			t.attr("x", (x - 10) +"")
		// 		});
		// 		xLine.attr({
		// 			x1: x +"",
		// 			x2: x + ""
		// 		})
		// 	}else if(xCount == games.length){
		// 		yLine.attr("x2", x + "")
		// 		yLines.forEach(l => {
		// 			l.attr("x2", x + "")
		// 		});
		// 	}
		// 	data.attr("cx",  x + "");
		// 	data.attr("cy",  y + "");
		// 	points += " " + x +  "," + y
		// 	let line = svg("line").attr({
		// 		y1:"5",
		// 		y2:"401"})
		// 	line.attr("x1", (x) + "");
		// 	line.attr("x2", (x) + "");
		// 	let text = $(document.createElementNS('http://www.w3.org/2000/svg', "text")).attr({
		// 		y:"430"})
		// 	text.attr("x", (x) + "");
			
		// 	text.html(game.name)
		// 	xLabels.append(text)
		// 	xGridLines.append(line)
		// 	scatterDataSet.append(data)
		// 	xCount++;
		// 	x+=xScaleInterval;
		// });
		xLabelTitle = $(document.createElementNS('http://www.w3.org/2000/svg', "text")).attr({
			x:"400",
			y:"470",
			class:"label-title"})
		xLabelTitle.html("Game");

		xLabels.append(xLabelTitle)
		chart.append(xLabels)
		chart.append(yLabels)
		console.log("Here")
		pLine.attr("points", points)

		$("#game").append($("<div> </div>").html(chart))
		//this.data.html(chart);

		
	}

	this.render = function(){
		let game = this.games[0];
		if(!game){
			return;
		}
		this.matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		this.guesses.innerHTML = game.guesses + " Guesses";
		this.getData();
		}

	this.addGame = function (game){
		let games = this.games;
		if(games.length > 0){
			if(games[0].state != "Complete"){
				games[0].state = "Incomplete"
			}
		}	
		games.push(game);
		let gamelist = this.gamelist;
		let score = game.scorebox;


		while(games.length> 10){
			games.pop();
		}
		let firstChild = gamelist.firstChild;

		if(firstChild){
			gamelist.insertBefore(score.box, firstChild);
		}else{
			gamelist.appendChild(score.box)
		}
		
		this.render();
	}

	this.gridInterval = function(max){
		let interval = Math.floor(max/10);
		interval = Math.max(interval, 1)

		return interval;
	}

} 

function gameMode(name, matchMultiplier, maxMatches){
	this.name = name;
	this.matchMultiplier = matchMultiplier;
	this.maxMatches = maxMatches;

	this.equals = function(matchMultiplier, maxMatches){
		if(this.matchMultiplier == matchMultiplier && this.maxMatches == maxMatches){
			return true;
		}
		return false
	}
}

function gameSettingsBar(){
	this.mode = document.createElement("button");
	this.matchMultiplier = document.createElement("input");
	this.maxMatches = document.createElement("input");
	this.gameModes = [];
	this.modeI = 1;
	
	this.init = function (){
		this.gameModes["Easy"] = new gameMode("Easy", 2, 6);
		this.gameModes["Medium"] = new gameMode("Medium", 3, 6);
		this.gameModes["Tuff"] = new gameMode("Tuff", 4, 6);
		this.gameModes["Insane"] = new gameMode("Insane", 5, 6);
		this.gameModes["Custom"] = new gameMode("Custom", 2, 8);

		this.modeKeys = Object.keys(this.gameModes);

		let div = document.createElement("div");
		div.style.fontSize = ".8em"

		let mode = this.mode;
		let settings = this;
		mode.addEventListener("click", () => settings.nextMode())

		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches;

		matchMultiplier.addEventListener("change", () => settings.changeMode())
		maxMatches.addEventListener("change", () => settings.changeMode())
		let maxMatchesLbl = document.createElement("label");
		maxMatchesLbl.innerHTML = "Matches to Win: ";
		maxMatchesLbl.style.gridArea = "maxMatchLbl";

		let matchMulLbl = document.createElement("label");
		matchMulLbl.innerHTML = "Cards per Match: ";
		matchMulLbl.style.gridArea = "matchMulLbl";


		maxMatches.setAttribute("type", "number");
		maxMatches.setAttribute("min", "2");
		maxMatches.setAttribute("max", allNames.length + "");
		maxMatches.style.gridArea = "maxMatchInput";



		matchMultiplier.setAttribute("type", "number");
		matchMultiplier.setAttribute("min", "2");
		matchMultiplier.setAttribute("max", "12");
		matchMultiplier.style.gridArea = "matchMulInput";

		mode.style.gridArea = "modeBtn";

		let modeLbl = document.createElement("label");
		modeLbl.innerHTML = "Mode: ";
		modeLbl.style.gridArea = "modeLbl";

		let newGameBtn = document.createElement("button");
		newGameBtn.innerHTML = "New Game";


		newGameBtn.addEventListener("click", () => newGame(settings.gameModes[settings.modeKeys[settings.modeI]]));

		let header = document.createElement("h4");
		header.innerHTML = "Game Options";
		header.style.gridArea = "header";

		div.appendChild(header);
		div.appendChild(modeLbl);
		div.appendChild(mode);
		div.appendChild(maxMatchesLbl);
		div.appendChild(maxMatches);
		div.appendChild(matchMulLbl);
		div.appendChild(matchMultiplier);
		div.appendChild(newGameBtn);

		document.getElementById("settings").appendChild(div);
		this.render();

	}

	this.render = function (){
		
		let currMode = this.gameModes[this.modeKeys[this.modeI]];
		let modeBtn = this.mode;
		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches; 

		modeBtn.innerHTML = currMode.name;
		matchMultiplier.value = currMode.matchMultiplier;
		maxMatches.value = currMode.maxMatches;



	}

	this.nextMode = function(){
		this.modeI++;
		if(this.modeI >= this.modeKeys.length){
			this.modeI = 0;
		}

		this.render();
	}

	this.changeMode = function(){
		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches;

		for (let i = 0; i < this.modeKeys.length; i++) {
			const key = this.modeKeys[i];
			if(this.gameModes[key].equals(matchMultiplier.value, maxMatches.value)){
				this.modeI = i;
				break;
			}
			this.modeI = i;

		}
		let key = this.modeKeys[this.modeI];
		if(key == "Custom"){
			this.gameModes[key].matchMultiplier = matchMultiplier.value;
			this.gameModes[key].maxMatches = maxMatches.value;
		}

		this.render();


	}



}

function scorebox(game){
	this.box = document.createElement("div");
	this.matches = document.createElement("h5");
	this.guesses = document.createElement("h5");
	this.matchMultiplier = document.createElement("h5");
	this.time = document.createElement("h6");
	this.timer = null;
	this.game = game;

	this.init= function (){
		let matches = this.matches;
		let guesses = this.guesses;

		let time = this.time;
		let box = this.box;
		let game = this.game;
		let matchMultiplier = this.matchMultiplier;
		let gamemode = document.createElement("h5");
		gamemode.innerHTML = "Game Mode: " + game.gamemode.name;
		$(box).addClass("scorebox")
		box.style.padding = "5px";
		box.innerHTML = "";
		matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		guesses.innerHTML = game.guesses + " Guesses";
		matchMultiplier.innerHTML =  game.gamemode.matchMultiplier + " Cards per Match" ;
		this.time.innerHTML = 0 + " Seconds";

		box.appendChild(gamemode)
		box.appendChild(guesses);
		box.appendChild(matches);
		box.appendChild(matchMultiplier);
		box.appendChild(time);
		
		};

	this.render	= function (){
		let matches = this.matches;
		let guesses = this.guesses;

		matches.innerHTML = game.matches + "/" + game.maxMatches + "  Matches"; 
		guesses.innerHTML = game.guesses + " Guesses";

		if(this.game.state == "Incomplete"){
			this.stopTimer();
		}
		
	}

	this.startTimer = function(){
		let start = new Date()
		this.timer = setInterval(function(start, time){ 

			if(game.state == "Incomplete"){
				game.scorebox.stopTimer();
			}

			
			let now = new Date().getTime();

			let secs =  (now - start) / 1000;
			secs = parseInt(secs)
			//let milli =  (now - start) % 1000;
			game.secs = secs;
			mins = parseInt(secs/60);

			secs%=60;
			if(secs<10){
				secs = "0"+secs;
			}
			time.innerHTML = mins +  ":" + secs;
			console.log(game.state)

		 }, 500, start.getTime(), this.time, this.game)
	}

	this.stopTimer = function(){
		clearInterval(this.timer);
	}




 this.init();

}



//Fisher Yates
function shuffle(arr){
	for (i = arr.length -1; i > 0; i--) {
		  j = Math.floor(Math.random() * i)
		  k = arr[i]
		  arr[i] = arr[j];
		  arr[j] = k;
		}

		return arr;
}

var sb = new scoreboard();
function newGame(gamemode = new gameMode("Easy", 2, 6)){
	var newG = new Game(gamemode);
	
	sb.addGame(newG)
	return newG;
}


function init(){
	setAllNames()
	var gameSettings = new gameSettingsBar();
	sb.init();
	gameSettings.init();
	newGame();

}

function svg(tag){
	return $(document.createElementNS('http://www.w3.org/2000/svg', tag))
}
	

function gcd(a, b){
	if (a == 0) 
	return b; 
  
return gcd(b % a, a); 
}













