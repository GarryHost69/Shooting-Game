const g = 9.8;
const inc = 0.5;
const velocity = 80;
var life;
var tick;
var player;
var score;
var grunt;
var death;
var fnt;
var sprite;
var spikes;
var lives = [];
var fl, hl;
var bullet;
var gunshot;
var mx, my;

function preload() {
	sprite = loadImage('assets/sprite.png');
	spikes = loadImage('assets/spikes.png');
	gunshot = loadSound('assets/GunShot.mp3');
	grunt = loadSound('assets/Grunt.mp3');
	death = loadSound('assets/Death.mp3');
	hl = loadImage('assets/halflife.png');
	fl = loadImage('assets/fulllife.png');
	fnt = loadFont('assets/ARCADECLASSIC.TTF');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	replay();
}

function draw() {
	if (lives.length > 0) {
		mx = mouseX;
		background(255);
		player.draw();
		switch (key) {
			case 'a':	player.moveleft();
			break;
			case 'd':	player.moveright();
			break;
			case 's':	if (bullet == undefined) {
				gunshot.setVolume(0.01);
				gunshot.play();
				bullet = new Bullet((player.levx + 50 * cos(player.angle)), (player.levy + 50 * sin(player.angle)), player.angle);
			}
			break;
		}
		if (player.jumping) {
			player.jump();
		}
		if (bullet != undefined) {
			bullet.draw();
			bullet.launch();
			if (bullet.y > 657 || bullet.y < 0 || bullet.x < 0 || bullet.x > 1366) {
				bullet = undefined;
			}
		}
		image(spikes, 0, 0);
		player.fallbehind();
		spikeCollision();
		tick++;
		score += 0.1;
		lifeBar();
	}
	else {
		background(175, 99, 172);
		textFont(fnt);
		textSize(150);
		text("YOU 	HAVE 	DIED!!", 80, 300);
		textSize(50);
		text("YOUR 	SCORE	 	" + floor(score), 80, 400);
		text("PLAY AGAIN", 105, 490);
	}
}

function mouseClicked() {
	if (lives.length == 0) {
		if (mouseX >= 80 && mouseX <= 380) {
			if (mouseY >= 450 && mouseY <= 500) {
				replay();
			}
		}
	}
}

function replay() {
	life = 0;
	tick = 0;
	score = 0;
	player = new Player();
	for (let i = 0; i < 5; i++) {
		lives.push(fl);
	}
}

function lifeBar() {
	let x = 1060;
	lives.forEach(e => {
		image(e, x, 10, 50, 50);
		x+=60;
	});
}

function spikeCollision() {
	if (player.x <= 78 && tick >= 50) {
		grunt.setVolume(0.05);
		grunt.play();
		if (life == 0) {
			lives.pop();
			lives.push(hl);
			life = 1;
		}
		else {
			lives.pop();
			life = 0;
		}
		if (lives.length == 0) {
			death.play();
		}
		tick = 0;
	}
}

function keyTyped() {
	switch (key) {
		case ' ': 	player.jumping = true;
					break;
	}
}

function mouseMoved() {
	if (mouseX < mx) {
		player.rotateLeverLeft();
	}
	if (mouseX > mx) {
		player.rotateLeverRight();
	}
}

function Player() {
	this.x = 145;
	this.y = 570;
	this.velocity = 20;
	this.jumping = false;
	this.jumpangle = 5;
	this.angle = 5;
	this.inc = 0.6;
	this.vx = this.velocity * cos(this.jumpangle);
	this.vy = this.velocity * sin(this.jumpangle);
	this.levx = this.x+68;
	this.levy = this.y+50;
	const r = 30;
	this.draw = function() {
		image(sprite, this.x, this.y);
		strokeWeight(8);
		line(this.levx, this.levy, (this.levx + r * cos(this.angle)), (this.levy + r * sin(this.angle)));
	}
	this.fallbehind = function() {
		if (this.x - 3 >= 72) {
			this.x -= 3;
			this.levx -= 3;
		}
	}
	this.jump = function () {
		this.x += this.vx * this.inc;
		this.y += this.vy * this.inc;
		this.levx += this.vx * this.inc;
		this.levy += this.vy * this.inc;
		this.vy += g * this.inc * 0.1;
		if (this.y + 87 >= 657) {
			this.jumping= false;
			this.y = 570;
			this.vx = this.velocity * cos(this.jumpangle);
			this.vy = this.velocity * sin(this.jumpangle);
			this.levx = this.x+68;
			this.levy = this.y+50;
		}
	}
	this.rotateLeverLeft = function() {
		if (this.angle > 2.40000000000000) {
			this.angle -= 0.1;
		}
	}
	this.rotateLeverRight = function() {
		if (this.angle < 8.299999999999995) {
			this.angle += 0.1;
		}
	}
	this.moveleft = function() {
		if (this.x - 10 >= 72) {
			this.x -= 10;
			this.levx -= 10;
		}
	}
	this.moveright = function() {
		this.x += 10;
		this.levx += 10;
	}
}

function Bullet(i, j, angle) {
	this.x = i;
	this.y = j;
	this.inc = 0.4;
	this.angle = angle;
	this.vx = velocity * cos(this.angle);
	this.vy = velocity * sin(this.angle);
	this.d = 3;
	this.draw = function() {
		fill(0);
		ellipse(this.x, this.y, this.d);
	}
	this.launch = function() {
		this.x += this.vx * this.inc;
		this.y += this.vy * this.inc;
		this.vy += g * this.inc * 0.1;
	}
}
