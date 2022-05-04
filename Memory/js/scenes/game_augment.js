class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.perdut = false;
    }	

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){	
		console.log("entra a create")
		let totescartes = ['co', 'co', 'cb', 'cb', 'sb', 'sb', 'so', 'so', 'tb', 'tb', 'to', 'to'];
		this.cameras.main.setBackgroundColor(0x2B65EC);
		var json = sessionStorage.getItem("config") || '{"cards":2, "tempsFora":3000, "perdrePunts":5}';
		var options_data = JSON.parse(json);
		var parells = options_data.cards;
		var dificultat = options_data.dificulty;
		var tempsFora = options_data.tempsFora;
		var puntuacioPerd = options_data.perdrePunts;
		var arraycards = totescartes.slice(0, parells * 2)
		var espaciadoX = parells/2 * 96;
		var espaciadoY = parells/2 * 128;
		
		this.score = 100;

		if (parells > 5){
			var files = 3
			var columnes = 4
			espaciadoX = espaciadoX/1.5;
		}
		else if (parells > 2){
			var files = 2
			var columnes = parells;
		}
		else{ 
			var files = 1
		  	var columnes = parells*2;
		  	espaciadoX = espaciadoX*2;
		}

		var a = 0;

		arraycards.sort((a, b) => 0.5 - Math.random());

		for (let iterador = 0; iterador < columnes; iterador++){
			for (let j = 0; j < files; j++){

				this.add.image(iterador*125 + this.cameras.main.centerX - espaciadoX, j*150 + this.cameras.main.centerY - espaciadoY/2, arraycards[a]);
				a += 1;	
			}
		}

		this.cards = this.physics.add.staticGroup();

		for (let iterador1 = 0; iterador1 < columnes; iterador1++){
			for (let j = 0; j < files; j++){
				this.cards.create(iterador1*125 + this.cameras.main.centerX - espaciadoX, j*150 + this.cameras.main.centerY - espaciadoY/2, 'back');
			}
		}

		let i = 0;
		
		var nivells = 0;

		var primer = false;

		this.cards.children.iterate((card)=>{
			card.card_id = arraycards[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);

				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						this.score -= puntuacioPerd;
						this.firstClick.enableBody(false, 0, 0, true, true);

						card.enableBody(false, 0, 0, true, true);

						var fallo = [];
						let aux = 0;


						for(let i = 0; i < parells*2; i++){
							for (let iterador = 0; iterador < columnes; iterador++){
								for (let j = 0; j < files; j++){
									let imatge = this.add.image(iterador*125 + this.cameras.main.centerX - espaciadoX, j*150 + this.cameras.main.centerY - espaciadoY/2, arraycards[aux]);
									fallo.push(imatge);
									aux++;
								}
							}
						}
					
						setTimeout(() =>{
							for (let iterador = 0; iterador < parells*2; iterador++){
								fallo[iterador].destroy();
							}
						},tempsFora);

						if (this.score <= 0){
							alert("Game Over");
							options_data.cards = 2;
							options_data.perdrePunts = 5;	
							options_data.tempsFora = 3000;
							sessionStorage.setItem("config", JSON.stringify(options_data));
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= parells){
							nivells ++;
							this.correct = 0;
							if (parells < 6) parells++;
							
							if (tempsFora > 500) tempsFora -= 500;
							puntuacioPerd += 5;

							options_data.cards = parells;
							options_data.perdrePunts = puntuacioPerd;
							options_data.tempsFora = tempsFora;	
							sessionStorage.setItem("config", JSON.stringify(options_data));
							this.scene.restart();
							
						}
					}
					this.firstClick = null;
				}
				else{
					console.log(card);
					this.firstClick = card;
				}
			}, card);
		});
	}
	
//	update (){	}
}

