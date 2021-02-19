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
        }
        drawX+=40;
      }
      drawY+=40;
    });
  }
}

function create(){
  const map = '11111111111111111111111111.'+
            '1                        1.'+
            '1                        1.'+
            '1 2  1     1     1     1 1.'+
            '1 1     1     1     1    1.'+
            '1                        1.'+
            '1                        1.'+
            '1    1     1     1     1 1.'+
            '1 1     1     1     1    1.'+
            '1                        1.'+
            '1                        1.'+
            '1    1     1     1     1 1.'+
            '1 1     1     1     1    1.'+
            '1                        1.'+
            '1                        1.'+
            '11111111111111111111111111';
  this.cameras.main.setBackgroundColor('#00F9E6');  
  this.platforms = this.physics.add.staticGroup();
  this.parseMap(map);
  this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	this.player.score = 0;
	this.scoreText = this.add.text(0, 0, "Score: "+this.player.score, {
		fill:"#000000",
		fontSize:"20px",
		fontFamily:"Arial Black"
	}).setScrollFactor(0).setDepth(200);
};




function update(){
  if (this.key_W.isDown && this.player.body.touching.down){
	  this.player.setVelocityY(-550);
  }
  if (this.key_A.isDown){
	  this.player.setVelocityX(-150);
  } else if (this.key_D.isDown){
	  this.player.setVelocityX(150);
  } else {
	  this.player.setVelocityX(0);
  }
}