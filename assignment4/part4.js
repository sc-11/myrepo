// Select the canvas and get its context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to generate a random number between min and max
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random color
function randomColor() {
    return 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
}

// Define the Shape class
class Shape {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }
}

// Define the Ball class extending Shape
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

// Define the EvilCircle class extending Shape
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

// Array to store all the balls
const balls = [];

// Create 25 balls with random properties and add them to the array
while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
        random(0 + size, canvas.width - size),
        random(0 + size, canvas.height - size),
        random(-7, 7),
        random(-7, 7),
        size,
        randomColor()
    );

    balls.push(ball);
}

// Create a single evil circle
const evilCircle = new EvilCircle(100, 100);

// Variable to keep track of ball count
let ballCount = balls.length;

// Function to update the ball count display
function updateBallCount() {
    document.querySelector('p').textContent = `Ball count: ${ballCount}`;
}

// Animation loop
function loop() {
    // Clear the canvas with a semi-transparent black rectangle to create a trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw, update, and detect collisions for each ball
    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }

    // Draw, check bounds, and detect collisions for the evil circle
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    // Request the next frame of the animation
    requestAnimationFrame(loop);
}

// Update the ball count display initially
updateBallCount();

// Start the animation
loop();
