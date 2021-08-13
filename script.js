let config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 20,
  height: window.innerHeight - 20,
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

let googleMap = null;

function loadMap(loaded) {
  const t = new Date().getTime();
  const googleCsv = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTyhshapjmrz_2NO3Mi33zbS2kF_1P94MAKxloRfszV-B29P3Z7ngmiJJAEb7_wlHX-PpzrFq8LWWGI/pub?output=csv&t=" + t;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      loaded(xmlhttp.responseText);
    }
  };
  xmlhttp.open("GET", googleCsv, true);
  xmlhttp.send(null);
}

loadMap(function (map) {
  googleMap = map;
  const game = new Phaser.Game(config);
})

function preload() {
  this.load.atlas("player", "assets/spritesheet.png", "assets/sprites.json");
  this.load.atlas("enemy", "assets/enemy.png", "assets/sprites.json");

  this.load.image("platform", "assets/platform.png");
  this.load.image("spike", "assets/spike.png");
  this.load.image("coin", "assets/coin.png");
  this.load.image("megacoin", "assets/megacoin.png");
  this.spawnEnemy = (x, y) => {
    this.enemies.create(x, y, "enemy", "sprite_0");
  }
  this.spawnPlayer = (x, y) => {
    this.player = this.physics.add.sprite(x, y, "player", "sprite_0");
    this.player.body.setGravityY(800);
    this.physics.add.collider(this.player, this.platforms);
    this.cameras.main.startFollow(this.player);
    this.player.score = 0;
    this.scoreText = this.add.text(0, 0, "Score: " + this.player.score, {
      fill: "#000000",
      fontSize: "20px",
      fontFamily: "Arial Black"
    }).setScrollFactor(0).setDepth(200);
  }
  this.parseMap = (map) => {
    let mapArr = map.split('\n');
    let drawX = 0;
    let drawY = 0;
    mapArr.forEach(row => {
      const rowS = row.split(',');
      console.log(rowS);
      drawX = 0;
      for (let i = 0; i < rowS.length; i++) {
        const c = rowS[i];
        console.log(c, drawX, drawY);
        if (c.charAt(0) === '1') {
          console.log('yes');
          this.platforms.create(drawX, drawY, "platform");
        } else if (c.charAt(0) === '2') {
          if (rowS[i + 1].charAt(0) === '1') {
            this.spawnPlayer(drawX - 4, drawY - 12);
          } else if (rowS[i - 1].charAt(0) === '1') {
            this.spawnPlayer(drawX + 4, drawY - 12);
          } else {
            this.spawnPlayer(drawX, drawY - 12);
          }
        } else if (c.charAt(0) === 'm') {
          this.megacoins.create(drawX, drawY + 10, "megacoin");
        } else if (c.charAt(0) === 'e') {
          this.spawnEnemy(drawX, drawY - 12);
        } else if (c.charAt(0) === 'c') {
          this.coins.create(drawX, drawY + 10, "coin");
        } else if (c.charAt(0) === 's') {
          this.spikes.create(drawX, drawY + 10, "spike");
        }
        //==================================
        drawX += 40;
      }
      drawY += 40;
    });
  }
}

function create() {

  this.cameras.main.setBackgroundColor('#00F9E6');
  this.platforms = this.physics.add.staticGroup();
  this.coins = this.physics.add.group();
  this.megacoins = this.physics.add.group();
  this.enemies = this.physics.add.group();

  this.spikes = this.physics.add.group();
  console.log(googleMap)
  this.parseMap(googleMap);
  this.collectCoin = (player, coin) => {
    player.score += 10;
    this.scoreText.setText("Score: " + this.player.score);
    coin.destroy();
  };
  this.collectMegaCoin = (player, megacoin) => {
    player.score += 100;
    this.scoreText.setText(" Score: " + this.player.score);
    megacoin.destroy();
  };

  this.die = () => {
    this.physics.pause();
    let deathText = this.add.text(0, 0, "YOU DIED", {
      color: "#d53636",
      fontFamily: "Arial Black",
      fontSize: "50px"
    }).setScrollFactor(0);
    Phaser.Display.Align.In.Center(deathText, this.add.zone(config.width / 2, config.height / 2, config.width, config.height));
  }
  this.physics.add.overlap(this.player, this.spikes, this.die, null, this);
  this.physics.add.overlap(this.player, this.enemies, this.die, null, this);

  this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
  this.physics.add.overlap(this.player, this.megacoins, this.collectMegaCoin, null, this);
  this.key_Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.key_Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  this.key_Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  this.key_Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

  this.anims.create({
    key: "walk",
    frames: [
      {
        key: "player", frame: "sprite_2"
      },
      {
        key: "player", frame: "sprite_1"
      }
    ],
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "stand",
    frames: [
      {
        key: "player", frame: "sprite_0"
      }
    ],
    frameRate: 1
  });
};

function update() {
  if ((this.key_W.isDown || this.key_Up.isDown || this.key_Space.isDown) && this.player.body.touching.down) {
    this.player.setVelocityY(-550);
  }
  if (this.key_A.isDown || this.key_Right.isDown) {
    this.player.setVelocityX(-200);
    this.player.anims.play("walk", true);
    this.player.flipX = true;
  } else if (this.key_D.isDown || this.key_Left.isDown) {
    this.player.setVelocityX(200);
    this.player.anims.play("walk", true);
    this.player.flipX = false;
  } else {
    this.player.setVelocityX(0);
    this.player.anims.play("stand", true);
  }
}

