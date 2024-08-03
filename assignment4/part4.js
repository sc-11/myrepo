
/*	Name: Sebastian Cosentino
	File: part4.js
	Date: August 2, 2024
	Purpose: Part 4 js of assignment 4
    */

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
    return 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
}

class Shape {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }
}

class Ball extends Shape {
    constructor(x, y, velX, velY, size, color) {
        super(x, y, velX, velY);
        this.size = size;
        this.color = color;
        this.exists = true;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= canvas.width) {
            this.velX = -this.velX;
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -this.velX;
        }

        if ((this.y + this.size) >= canvas.height) {
            this.velY = -this.velY;
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -this.velY;
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball) && ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomColor();
                }
            }
        }
    }
}

class EvilCircle extends Shape {
    constructor(x, y) {
        super(x, y, 20, 20);
        this.color = 'white';
        this.size = 10;

        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "a":
                    this.x -= this.velX;
                    break;
                case "d":
                    this.x += this.velX;
                    break;
                case "w":
                    this.y -= this.velY;
                    break;
                case "s":
                    this.y += this.velY;
                    break;
            }
        });
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    checkBounds() {
        if ((this.x + this.size) >= canvas.width) {
            this.x = canvas.width - this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.x = this.size;
        }

        if ((this.y + this.size) >= canvas.height) {
            this.y = canvas.height - this.size;
        }

        if ((this.y - this.size) <= 0) {
            this.y = this.size;
        }
    }

    collisionDetect() {
        for (const ball of balls) {
            if (ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                    ballCount--;
                    updateBallCount();
                }
            }
        }
    }
}
