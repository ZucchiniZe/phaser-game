var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

function Boot(game) {};

Boot.prototype = {
  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);
  },
  create: function() {
    this.state.start('Preload')
  }
}

function Preload(game) {};

Preload.prototype = {
  preload: function() {
    this.load.image('sky', 'img/sky.png');
    this.load.image('ground', 'img/platform.png');
    this.load.image('star', 'img/star.png')
    this.load.image('diamond', 'img/diamond.png');
    this.load.spritesheet('dude', 'img/dude.png', 32, 48);
    this.add.plugin(Phaser.Plugin.Debug);
  },
  create: function() {
    this.state.start('Game');
  }
}

function Game(game) {
  this.score = 0;
};

Game.prototype = {
  create: function() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.add.sprite(0, 0, 'sky');
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    var ground = this.platforms.create(0, this.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    var ledge = this.platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = this.platforms.create(-150, 200, 'ground');
    ledge.body.immovable = true;

    this.player = this.add.sprite(32, this.world.height - 150, 'dude')
    this.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 1000;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.items = this.add.group();
    this.items.enableBody = true;
    for(var i=0; i < 12; i++) {
      if(Math.floor(Math.random() * 10) % 2) {
        var item = this.items.create(i * 70, 70, 'star');
        item.body.gravity.y = 300;
        item.body.bounce.y = 0.7 + Math.random() * 0.2;
        item.score = Math.floor(Math.random() * 10);
      } else {
        var item = this.items.create(i * 70, 70, 'diamond');
        item.body.gravity.y = 450;
        item.body.bounce.y = 0.5 + Math.random() * 0.2;
        item.score = Math.floor(Math.random() * 100);
      }
    }

    this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});

    this.spaceBar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function() {
    this.physics.arcade.collide(this.player, this.platforms);
    this.physics.arcade.collide(this.items, this.platforms);

    this.physics.arcade.overlap(this.player, this.items, collectStar, null, this);

    function collectStar(player, item) {
      item.kill();
      this.score += item.score;
      this.scoreText.text = 'Score: ' + this.score;
    }

    this.player.body.velocity.x = 0;

    if(this.cursors.left.isDown) {
      this.player.body.velocity.x = -350;
      this.player.animations.play('left');
    } else if(this.cursors.right.isDown) {
      this.player.body.velocity.x = 350;
      this.player.animations.play('right');
    } else {
      this.player.animations.stop();
      this.player.frame = 4;
    }

    if((this.cursors.up.isDown || this.spaceBar.isDown) && this.player.body.touching.down) {
      this.player.body.velocity.y = -635;
    }
  }
}

game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
game.state.add('Game', Game);
game.state.start('Boot');
