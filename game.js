window.onload = function(){

    var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('player', 'assets/body.png');
    game.load.image('enemy', 'assets/enemy.gif');
    game.load.image('enemy2', 'assets/enemy2.gif');
    game.load.image('misc', 'assets/misc.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('rocket', 'assets/rocket.png');
    game.load.image('turret', 'assets/turret.gif');

    game.load.image('missilepickup', 'assets/ammopickup.gif');
    game.load.image('start', 'assets/start.png');
    game.load.image('end', 'assets/end.jpg');

    game.load.image('enemybullet', 'assets/enemybullet.gif');

    game.load.image('enemydeath','assets/enemydeath.gif')

    game.load.image('tophud', 'assets/tophud.png');
    
    game.load.image('bg', 'assets/scrollinbg.jpg');
    game.load.spritesheet('playersprite', 'assets/sprite.gif', 115, 134, 4);
    game.load.spritesheet('deathscore', 'assets/score.gif', 35, 14, 8);
    game.load.spritesheet('deathscoreturret', 'assets/scoreturret.gif', 35, 14, 8);

    game.load.audio('music', 'assets/Crazy Motorcycle.mp3');

   
   

}

var player;
var enemy;
var enemies;
var blank;
var turrets;
var turret;

var missKey;
var missKeyIsTrue= false;
var missAmmo = 0;
var ammoCount = 0;
var missPickups;
var missPickup;

var ground;
var platforms;

var shieldgroup;
var shieldshard;


var deathscore;
var gamespeed;

var music;

var bullets;
var enemyBullets;

var ammoString = '';
var ammoText;

var statusString = '';
var statusText;

var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var firingTimer = 0;
var stateText;
var livingEnemies = [];

var enemyCounter = 0;

var scoreTimer;

var hud;
var soundeffect;

var gamestarted = false;
var gamestartedplay;

var beginningpic;

var video = document.getElementById("video1");



var levelbool = false;
function create() {

    var gamestartedplaystring = 'Space = Primary | E = Secondary';
    gamestartedplay = game.add.text(394, 55, gamestartedplaystring , { font: '20px ARIAL BLACK', fill: '#818d79' });
    game.input.onTap.addOnce(restart,this);
    
    


    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.events.add(Phaser.Timer.SECOND*1,updateScore,this);
    gamespeed= -100;

    // music % bg
    music = game.add.audio('music');
    bg = game.add.tileSprite(0, 0, 1000, 600, 'bg');

    // Bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(300, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);

    // Enemy Bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(300, 'misc');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('scale.x',0.2);
    enemyBullets.setAll('scale.x',0.25);

    // 


    // Shield
    shieldgroup = game.add.group();
    shieldgroup.enableBody = true;
    shieldgroup.physicsBodyType = Phaser.Physics.ARCADE;
    shieldgroup.createMultiple(3, 'misc');
    shieldgroup.setAll('anchor.x', 0.5);
    shieldgroup.setAll('anchor.y', 1);
    shieldgroup.setAll('outOfBoundsKill', true);


    //  Player
    player = game.add.sprite(20, 250, 'playersprite');
    player.animations.add('foreward');
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(1, 1);  
    game.physics.enable(player, Phaser.Physics.ARCADE);


    //  Enemues
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;



    // Pickups
    missPickups = game.add.group();
    missPickups.enableBody = true;
    missPickups.physicsBodyType = Phaser.Physics.ARCADE;




    // Turrets
    turrets = game.add.group();
    turrets.enableBody = true;
    turrets.physicsBodyType = Phaser.Physics.ARCADE;


    hud = game.add.sprite(0, 0, 'tophud');
    hud.fixedToCamera = true;

    //  Score
    scoreText = game.add.text(230, 37, scoreString + Math.round(score), { font: '20px Courier New', fill: '#bec8b7' });


    // MissileAmmo
    ammoString = '';
    ammoText = game.add.text(185, 70, ammoString + Math.round(ammoCount), { font: '20px Courier New', fill: '#bec8b7' });


    statusString = 'Space = Primary | E = Secondary';
    statusText = game.add.text(394, 55, statusString , { font: '12px Courier New', fill: '#818d79' });



    //  Lives
    lives = game.add.group();
    lives.x = -20;
    lives.scale.y = 0.8;
    game.add.text(game.world.width - 100, 10, '', { font: '20px Courier New', fill: '#fff' });




    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    //health 
    for (var i = 0; i < 10; i++) 
    {
        var lifeblock = lives.create(game.world.width-288 + (31 * i), 75, 'misc');
        lifeblock.anchor.setTo(0.5, 0.5);
        lifeblock.scale.y = 0.44;
        lifeblock.scale.x = 0.7;
        lifeblock.angle = 90;
        lifeblock.alpha = 0.4;
    }



    //  CustomControls
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downButton = game.input.keyboard.addKey(Phaser.Keyboard.S);

    //Boundries 
    platforms = game.add.group();
    ground = platforms.create(0, game.world.height - 64, 'misc');
    ground.scale.setTo(0.01, 0.01);
    player.body.collideWorldBounds = true;
    game.physics.enable(player, Phaser.Physics.ARCADE);
     
                music.play();  
                createTurrets();
                createMissilePickup();
                createEnemies();   
                       beginningpic = game.add.sprite(0, 0, 'start');
                       blank = game.add.sprite(0, 0, 'end');
                       blank.visible=false;
}



function updateScore(){
    score++;
    score ++;
    game.time.events.add(Phaser.Timer.SECOND*0.4,updateScore,this);
    if((Math.floor(score%50)==0)){
        gamespeed = gamespeed - 100;
    }

}



function createEnemies() {  
        game.time.events.loop(Phaser.Timer.SECOND*1.5, generateEnemy,this);
       
}

function createTurrets() {
        game.time.events.loop(Phaser.Timer.SECOND*5, generateTurrets,this);    
}
function createMissilePickup() {
        game.time.events.loop(Phaser.Timer.SECOND*10, generateMissPickup,this) 
}




function ammoPick(){
    bullets.createMultiple(3, 'bullet');
}
function generateEnemy(){
        var randY = Math.random() * (550 - 150) + 150;
        var randEnemy = Math.floor(Math.random() * (2 - 0) + 0);
        var enemyArray = ['enemy','enemy2'];
        var enemy = enemies.create(game.width-50, randY, enemyArray[randEnemy]);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;  
        enemy.body.velocity.x = -200 + (gamespeed/2);
        enemyCounter++;  
}

function generateTurrets(){
        var turret = turrets.create(game.width-50, 100, 'turret');
        turret.anchor.setTo(0.5, 0.5);
        turret.checkWorldBounds = true;
        turret.outOfBoundsKill = true;  
        turret.body.velocity.x = gamespeed*1;
        var enemyBullet = enemyBullets.create(turret.body.x, turret.body.y, 'enemybullet');
        enemyBullet.anchor.setTo(0.5, 0.5);
        enemyBullet.checkWorldBounds = true;
        enemyBullet.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.moveToObject(enemyBullet,player,500);
}


function generateMissPickup(){
        var missPickup = missPickups.create(game.width-50, 570, 'missilepickup');
        missPickup.anchor.setTo(0.5, 0.5);
        missPickup.scale.setTo(1.5, 1.5);
        missPickup.checkWorldBounds = true;
        missPickup.outOfBoundsKill = true;  
        missPickup.body.velocity.x = gamespeed;
        missPickup.physicsBodyType = Phaser.Physics.ARCADE;
}


function missileCollision (player,missile) {
    ammoCount = 10;
    missKeyIsTrue = true;
    missAmmo = 0;
    missile.kill();

}

function killObject(obj){
    obj.destroy();
}

function descend() {
    aliens.y += 10;
}

function update() {
    if(gamestarted == true){

                    ammoText.text = ammoString + Math.round(ammoCount);
                    scoreText.text = scoreString + Math.round(score);
                    shieldgroup.x = player.body.x;
                    shieldgroup.y = player.body.y-340;
                    player.body.velocity.y = 50;
                    bg.tilePosition.x += gamespeed/100;
                    player.body.velocity.x = 0;

                    if (leftButton.isDown)
                    {
                        player.body.velocity.x = -200;
                    }
                    if (rightButton.isDown)
                    {
                        player.body.velocity.x = 200;
                        player.animations.play('foreward', 20, true);
                    }
                    if(rightButton.isUp){
                        player.frame = 0;
                    }
                    if (upButton.isDown)
                    {
                        player.body.velocity.y = -400;
                    }
                    if (downButton.isDown)
                    {
                        player.body.velocity.y = 500;
                    }

                    if (fireButton.isDown)
                    {
                        fireBullet();
                        //createShield();
                        //fireBulletTrio();
                        
                    }
                    if (player.body.touching.down)
                    {
                        player.body.velocity.y = -350;

                    }

                    
                    missKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
                    missKey.onDown.add(fireBulletTrio,this);
                    



                    game.physics.arcade.overlap(bullets, turrets, collisionHandlerTurret, null, this);
                    game.physics.arcade.overlap(bullets, enemies, collisionHandlerEnemy, null, this);



                    game.physics.arcade.overlap(enemyBullets, shieldgroup, collisionHandler, null, this);
                    game.physics.arcade.overlap(enemies, shieldgroup, collisionHandler, null, this);
                    game.physics.arcade.overlap(shieldgroup, enemies, collisionHandler, null, this);
                    game.physics.arcade.overlap(shieldgroup, enemyBullets, collisionHandler, null, this);


                    game.physics.arcade.overlap(enemies, player, enemyHitsPlayer, null, this);
                    
                    game.physics.arcade.overlap(enemies, player, enemyHitsPlayer, null, this);
                    game.physics.arcade.overlap(enemies, shieldgroup, collisionHandler, null, this);
                   

                    game.physics.arcade.overlap(missPickups, player, missileCollision, null, this);
        }

}

function createShield(){
     for (var i = 0; i < 5; i++) {
         var shieldshard = shieldgroup.create(player.body.x + 100, player.body.y + (30*i), 'misc');
         shieldshard.scale.setTo(0.2, 0.25);  
         shieldshard.anchor.setTo(0.5, 0.5);
         shieldshard.checkWorldBounds = true;
         shieldshard.physicsBodyType = Phaser.Physics.ARCADE;
         if(i==1){
            for (var j = 0; j < 3; j++) {
                var shieldshard = shieldgroup.create(player.body.x + 100+(20), player.body.y+30 + (30*j), 'misc');
                shieldshard.scale.setTo(0.2, 0.25);  
                shieldshard.anchor.setTo(0.5, 0.5);
                shieldshard.checkWorldBounds = true;
                shieldshard.physicsBodyType = Phaser.Physics.ARCADE;
            }
         }
     };

}


function collisionHandler (bullet, enemy) {
    bullet.kill();
    enemy.kill();
    score += 10;
    scoreText.text = scoreString + Math.round(score);
}
function collisionHandlerEnemy (bullet, enemy) {
    bullet.kill();
    var death = game.add.sprite(enemy.x, enemy.y-30, 'deathscore');
    death.animations.add('deathanimation');
    death.animations.play('deathanimation', 20, false);
    
    enemy.kill();
    score += 20;
    scoreText.text = scoreString + Math.round(score);
}

function collisionHandlerTurret (bullet, enemy) {
    bullet.kill();
    
    var death = game.add.sprite(enemy.x, enemy.y-30, 'deathscoreturret');
    death.animations.add('deathanimationturret');
    death.animations.play('deathanimationturret', 20, false);
    
    enemy.kill();
    score += 20;
    scoreText.text = scoreString + Math.round(score);
}



function enemyHitsPlayer (player,bullet) {
    bullet.destroy();
    live = lives.getFirstAlive();
    if (live)
    {
         live.kill();
    }
    if (lives.countLiving() < 1)
    {
        
        player.kill();

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;
        blank.visible = true;
        game.input.onTap.addOnce(restart,this);
        
        document.getElementById('video').style.visibility="visible";
        music.stop();
        video.play();

    }

}


function fireBullet () {



    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);
        if (bullet)
        {
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.x = 700;
            bulletTime = game.time.now + 200;
        }
        
    }

}

function fireBulletTrio () {
    if(missKeyIsTrue){
        if(missAmmo < 9){
            for (var i = 0; i < 3; i++) {
                var bullet = bullets.create(player.body.x, player.body.y+(i*30), 'rocket');
                bullet.scale.setTo(0.6, 0.6);  
                bullet.anchor.setTo(0.5, 0.5);
                bullet.checkWorldBounds = true;
                bullets.physicsBodyType = Phaser.Physics.ARCADE;
                bullet.body.velocity.x = 700;

            }
        }else{
            missKeyIsTrue = false;
        }
        missAmmo++;
        ammoCount--;
    }

}

function resetBullet (bullet) {
    bullet.destroy();
}

function restart () {
    gamestarted = true;
    blank.visible = false;
    beginningpic.visible = false;
    gamespeed= -100;
    document.getElementById('video').style.visibility="hidden";
        music.play();
        video.pause();
    
    
        
    lives.callAll('revive');
    enemies.removeAll();
    createEnemies();
    player.revive();
    stateText.visible = false;
    score = 0;
    player.body.x=20;
        player.body.y=250;

}


function render() { 


}

}
