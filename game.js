var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

var platforms;
var player;
var cursors;
var items;
var score = 0;
var scoreText;
var spaceBar

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png')
  game.load.image('diamond', 'assets/diamond.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'sky');
  platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 200, 'ground');
  ledge.body.immovable = true;

  player = game.add.sprite(32, game.world.height - 150, 'dude')
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 1000;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  cursors = game.input.keyboard.createCursorKeys();

  items = game.add.group();
  items.enableBody = true;
  for(var i=0; i < 12; i++) {
    if(Math.floor(Math.random() * 10) % 2) {
      var item = items.create(i * 70, 70, 'star');
      item.body.gravity.y = 300;
      item.body.bounce.y = 0.7 + Math.random() * 0.2;
      item.score = Math.floor(Math.random() * 10);
    } else {
      var item = items.create(i * 70, 70, 'diamond');
      item.body.gravity.y = 450;
      item.body.bounce.y = 0.5 + Math.random() * 0.2;
      item.score = Math.floor(Math.random() * 100);
    }
  }

  scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});

  spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(items, platforms);

  game.physics.arcade.overlap(player, items, collectStar, null, this);

  function collectStar(player, item) {
    item.kill();
    score += item.score;
    scoreText.text = 'Score: ' + score;
  }

  player.body.velocity.x = 0;

  if(cursors.left.isDown) {
    player.body.velocity.x = -350;
    player.animations.play('left');
  } else if(cursors.right.isDown) {
    player.body.velocity.x = 350;
    player.animations.play('right');
  } else {
    player.animations.stop();
    player.frame = 4;
  }

  if((cursors.up.isDown || spaceBar.isDown) && player.body.touching.down) {
    player.body.velocity.y = -600;
  }
}
