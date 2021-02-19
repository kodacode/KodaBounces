let config = {
	type: Phaser.AUTO,
  width: 1300,
  height: 630,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
const game = new Phaser.Game(config);
function preload(){
  this.load.atlas("player", "assets/spritesheet.png", "assets/sprites.json");
  this.load.image("platform", "assets/platform.png");
  this.load.image("spike", "assets/spike.png");
  this.load.image("coin", "assets/coin.png");
  this.spawnPlayer = (x, y) => {
	  this.player = this.physics.add.sprite(x, y, "player", "sprite_0");
  	this.player.body.setGravityY(800);
  	this.physics.add.collider(this.player, this.platforms);
	  this.cameras.main.startFollow(this.player);
    this.player.score = 0;
	  this.scoreText = this.add.text(0, 0, "Score: "+this.player.score, {
		fill:"#000000",
		fontSize:"20px",
		fontFamily:"Arial Black"
	}).setScrollFactor(0).setDepth(200);
  }
  this.parseMap = (map) => {
    let mapArr = map.split('.');
    let drawX = 0;
    let drawY = 0;
    mapArr.forEach(row=>{
	drawX = 0;
	for(let i = 0; i<row.length; i++){
		if(row.charAt(i)==='1'){
			this.platforms.create(drawX, drawY, "platform");
		}else if(row.charAt(i)==='2'){
			if(row.charAt(i+1)==='1'){
				this.spawnPlayer(drawX-4, drawY-12);
			}else if(row.charAt(i-1)==='1'){
				this.spawnPlayer(drawX+4, drawY-12);
			}else{
				this.spawnPlayer(drawX, drawY-12);					
			}
		}else if(row.charAt(i)==='c'){
			this.coins.create(drawX, drawY+10, "coin");
        //==================================
		}else if(row.charAt(i)==='s'){
        	this.spikes.create(drawX, drawY+10, "spike"); 
        }
        //==================================
		drawX+=40;
	}
	drawY+=40;
});
  }
}

function create(){
 const map = '11111111111111111111111111.'+
            '1               c        1.'+
            '1    c     c     s     c 1.'+
            '1 2  1  s  1  c  1  c  1 1.'+
            '1 1     1     1     1    1.'+
            '1                        1.'+
            '1    c     c     s     s 1.'+
            '1 c  1  s  1  c  1  c  1 1.'+
            '1 1     1     1     1    1.'+
            '1                        1.'+
            '1    c     s     c     c 1.'+
            '1 s  1  c  1  c  1  s  1 1.'+
            '1 1     1     1     1    1.'+
            '1                        1.'+
            '1   c       c     c   c  1.'+
            '11111111111111111111111111';
  this.cameras.main.setBackgroundColor('#00F9E6');  
  this.platforms = this.physics.add.staticGroup();
  this.coins = this.physics.add.group();
  this.spikes = this.physics.add.group();
  this.parseMap(map);
  this.collectCoin = (player, coin)=>{
	  player.score+=10;
    this.scoreText.setText("Score: "+ this.player.score);
    coin.destroy();
  };
  this.die = ()=>{
	  this.physics.pause();
    let deathText = this.add.text(0, 0, "YOU DIED", {
        color:"#d53636",
        fontFamily:"Arial Black",
        fontSize:"50px"
    }).setScrollFactor(0);
    Phaser.Display.Align.In.Center(deathText, this.add.zone(650, 315, 1300, 630));
  }
  this.physics.add.overlap(this.player, this.spikes, this.die, null, this);


  this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
  this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	
  this.anims.create({
    key:"walk",
    frames:[
      {
        key:"player", frame:"sprite_2"
      }, 
      {
        key:"player", frame:"sprite_1"
      }
    ],
    frameRate:10,
    repeat:-1
  });
  this.anims.create({
    key:"stand",
    frames:[
      {
        key:"player", frame:"sprite_0"
      }
    ],
    frameRate:1
  });
};




function update(){
  if (this.key_W.isDown && this.player.body.touching.down){
	  this.player.setVelocityY(-550);
  }
  if (this.key_A.isDown){
	  this.player.setVelocityX(-200);
    this.player.anims.play("walk", true);
     this.player.flipX = true;
  } else if (this.key_D.isDown){
	  this.player.setVelocityX(200);
    this.player.anims.play("walk", true);
     this.player.flipX = false;
  } else {
	  this.player.setVelocityX(0);
    this.player.anims.play("stand", true);
  }
}