class Game{
 constructor(gamemode = new gameMode("Easy", 2, 6)){
     Game.count++;
	this.cards = [];
	this.cardsSelected = [];
	this.guesses = 0;
	this.matches = 0;
	this.timer = 0;
    this.gamemode = gamemode;
    this.name = "Game " +  Game.count;
	
	this.matchChain = false;
	this.maxMatches = gamemode.maxMatches;
	this.scorebox = new scorebox(this);
	this.state = "prematch";
	this.matchMultiplier = Math.max(gamemode.matchMultiplier, 2);
	this.currentTimeout

	this.render = function (){
		for(let i = 0; i < this.rows; i++){
			for(let j = 0; j < this.cols; j++){
				let card = this.table[i][j];
				card.render();
			}
		}
		this.scorebox.render();

	}

	this.clearSelection = function(){
		this.cardsSelected.forEach(card => {
			card.selected = false;
			card.changeState("Turned Down");
			card.render();
		});

		this.cardsSelected = [];

		this.render();
	
	}

	this.testMatchChain = function (cards){
		let first = cards.length-1;
		let name = cards[first].name
 

		for (let i = 0; i < cards.length; i++) {
			const card = cards[i];
			if(name!=card.name){
				this.guesses++;

				return false;
			}
		}	
		return true;
	}

	this.select = function(card){
		console.log(card.name + " " + card.state);
		if(!this.matchChain){
			this.clearSelection();
		}
		
		let message = "";
		
		if(this.state == "prematch"){
			this.scorebox.startTimer();
			this.state = "started";
		}


		if(!(card.selected || card.matched)){
			clearTimeout(this.currentTimeout);

			this.cardsSelected.push(card);
			message += card.name + " Was Selected\n";
			card.selected = true;
			card.changeState("Selected");
			 this.currentTimeout = setTimeout(function(game){
				game.cardsSelected.forEach(card => {
					card.selected = false;
					card.changeState("Turned Down");
					card.render();
					console.log(card.name + " " + card.state);
				});
		
				game.cardsSelected = [];
		
				game.render();
			
			}, 5000, this);
			card.flipped = true;
			
		}

		this.matchChain = this.testMatchChain(this.cardsSelected);

		if(this.matchChain && (this.cardsSelected.length == this.matchMultiplier)){
			clearTimeout(this.currentTimeout);
			this.cardsSelected.forEach(card => {
				card.matched = true;
				card.changeState("Matched");
			});
			this.matches++;
			this.matchChain = false;
			this.currentTimeout = setTimeout(function(game){
				game.cardsSelected.forEach(card => {
					card.selected = false;
					card.changeState("Turned Down");

					
					card.render();
				});
		
				game.cardsSelected = [];
		
				game.render();
			
			}, 5000, this);

		}

		if(!this.matchChain){
			this.cardsSelected.forEach(card => {
				card.changeState("Bad Select");
				card.render();
			});
		}
	

		if(this.matches == this.maxMatches){
			this.scorebox.stopTimer();
			this.state = "Complete";
		}
		this.render();
		console.log(card.name + " " + card.state);
	} 

	

	this.init = function(){
		let matchMultiplier = this.matchMultiplier;
		let maxMatches = this.maxMatches;
		this.cols = Math.max(matchMultiplier, maxMatches);
		this.rows = Math.min(matchMultiplier, maxMatches);
		let names = [];
		let cardMax = function (grid){
			let max =  grid.cols;
			if(grid.cols%grid.rows == 0){
				console.log()
				grid.cols = grid.cols / grid.rows;
				grid.rows = (max * grid.rows) / grid.cols;
			}
			let temp = Math.max(grid.cols, grid.rows);
			if(window.screen.height> window.screen.width){
				grid.cols = Math.min(grid.cols, grid.rows);
				grid.rows = temp;
			}else{
				grid.rows = Math.min(grid.cols, grid.rows);
				grid.cols = temp;
			}
			
			

			if(grid.cols > max){
				grid.cols = Math.max(matchMultiplier, maxMatches);
				grid.rows = Math.min(matchMultiplier, maxMatches);
			}
			
			let maxMax = allNames.length * grid.matchMultiplier;
			
			let i = grid.rows * grid.cols;
			console.log(grid.rows +  " " + grid.cols + " " + i);

			return i;
		}
 


		this.cardMax = cardMax(this);
		this.maxMatches = this.cardMax/this.matchMultiplier;
		while(names.length < this.maxMatches){
			let randPos = Math.floor(Math.random() * allNames.length);
			if(!names.includes(allNames[randPos])){
				names.push(allNames[randPos]);
			}

		}

		let table = function(rows){
			let t = [];
			for (var i = 0; i < rows; i++) {
			 t[i] = [];
			}
			return t;
		}



		for (let i = names.length - 1; i >= 0; i--) {
			for(let j = 0; j < this.matchMultiplier; j++){
				this.cards.push(new card(names[i]));
			}
			
			

		}

		this.table = table(this.rows);

		let setTable = function(grid){
			grid.cards = shuffle(grid.cards);
			for (let i = 0; i < grid.table.length; i++) {
				for (let j = 0; j < grid.cols; j++) {

					let rand = Math.floor(Math.random() *grid.cards.length);

					let card = grid.cards.pop();
					card.init();
					card.pos(i, j);
					grid.table[i].push(card);
					


				}	
			}

		}
		setTable(this);
		
		document.getElementById("game").innerHTML = "";
		let div = document.createElement("div");
		let header = document.createElement("h3");
		header.style.textAlign = "center"
		div.appendChild(header)
		header.innerHTML = this.gamemode.name;
		let section = document.createElement("section");
		section.style.display = "grid";
		let gridTemplateCol = "";
		let gridTemplateRows = "";
		for(let i = 0; i < this.rows; i++){
			gridTemplateCol = "";
			for(let j = 0; j < this.cols; j++){
				let card = this.table[i][j];
				gridTemplateCol += 100.00/ this.cols - 4 + "% ";
				card.render();
				card.element.addEventListener("click", () => this.select(card));
				section.appendChild(card.element);
				

			}
			this.scorebox.render();

			gridTemplateRows += 100.00/ this.rows - 4 + "% ";

			

			
		}


		section.style.gridTemplateColumns = gridTemplateCol;
		//section.style.gridTemplateRows = gridTemplateRows;
		//section.style.gridGap = "2%";

		div.appendChild(section);
		document.getElementById("game").appendChild(div)

	}

	this.init();
    
    
	
	
}

static count = 0;
}