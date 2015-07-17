var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

//Global Variables
var timeInterval = 25;
var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;
var gravity = height / 1000; //
var score = 0;

var labelX = width * 0.1;
var labelY = height * 0.1;
var fontSize = 40;
var ballRadius = Math.floor(height * 0.035);


if(isMobile.any()) {
    fontSize = 10;
    
}


var paper = Raphael(0,0,width,height);
var background = paper.rect(0,0,width,height);
background.attr("fill", "black");
var balls = [];
var timeElapsed = 0;
var gameOver = false;



function Ball(x,y,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = 0;
    this.vy = 0;
    this.hiddenBall = paper.circle(this.x,this.y, ballRadius + 1 * ballRadius);
    this.ball = paper.circle(this.x,this.y,ballRadius);
    this.draw = function(){
        this.ball.attr('fill','#f00');
        this.hiddenBall.attr('opacity', 0);
        this.hiddenBall.attr('fill', '#fff');
    };
    this.my_animate = function() {
        this.x = this.x + this.vx;
        if(this.vy < 20){
            this.vy = this.vy + gravity;
        }
        this.y = this.y + this.vy;
        //this.y = this.y + 10;
        this.ball.animate({cx: this.x, cy: this.y});
        this.hiddenBall.animate({cx: this.x, cy: this.y});
    };
    this.bounce = function(){
        this.vy = -(height * 0.04);
        if(this.x < width/2){
            this.vx = width * 0.008;
            //this.vx = width * 0.02; //Extreme Mode for Bounce Wall Testing
        } else {
            this.vx = -(width * 0.008);
        }
    };
    //Checks if it should bounce
    this.should_bounce = function(){
        //bounce up
        if(this.y > 0.8*height){
            return true;
        } else {
            return false;
        }
        
    };
    this.should_bounce_off_wall = function(){
        //bounce off side
        if(this.x + ballRadius >= width || this.x - ballRadius <= 0){ //bounce left
            return true;
        } else {
            return false;
        }
    }
}

var line = paper.path("M0 " + Math.floor(0.8 * height) + "L" + width + " " + Math.floor(0.8 * height));
line.attr("stroke", "white");

var scoreLabel = paper.text(labelX,labelY, "score\n" + score).attr({fill:'white'});
scoreLabel.attr({"font-size":fontSize});

var start_game_event = function() {
    timeElapsed = 0;
    score = 0;
    scoreLabel.remove();
    scoreLabel = paper.text(labelX,labelY, "score\n" + score).attr({fill:'white'});
    scoreLabel.attr({"font-size":fontSize});
    gameOver = false;
    for(var i = 0; i < balls.length; i++){
        balls[i].ball.remove();
        balls[i].hiddenBall.remove();
    }
    balls = [];
    var first_ball = new Ball(50, 50, ballRadius);
    first_ball.draw();
    first_ball.ball.mousedown(function() {
       click_event(); 
    });
    first_ball.hiddenBall.mousedown(function() {
       click_event(); 
    });
    balls.push(first_ball);
    document.body.removeEventListener("click", start_game_event);
};

start_game_event();

var click_event = function(){
    for(var i = 0; i < balls.length; i++){
        if(balls[i].should_bounce()){
            console.log('');
            balls[i].bounce();
        }
    }
};


var globalInterval = setInterval(function(){ 
    if (gameOver) {
        for(var i = 0; i < balls.length; i++){
            balls[i].ball.unmousedown(click_event);
            balls[i].hiddenBall.unmousedown(click_event);
        }
        /*for(var i = 0; i < balls.length; i++){
            var dyingBall = balls[i];
            dyingBall.ball.animate({fill: "#fffe33", r: dyingBall.radius + 30}, 1000, function(){
                dyingBall.ball.animate({fill: "#fff", r:0}, 1000, function(){
                    console.log("it should disappear");
                    dyingBall.ball.animate({cy: height+200}); //clear ball
                    dyingBall.y = height + 200;
                }); //explosion effect
            });
        }
        */
        //move score label to center
        scoreLabel.animate({"font-size": fontSize * 2, x:width/2, y:height/2, text:"score:\n" + score},500);

        document.body.addEventListener("click", start_game_event);
        /*
        var gameOverOver = true;
        for(var i = 0; i < balls.length; i++){
            if (balls[i].y < height + 200) {
                console.log('GAME OVER OVER FALSE');
                //gameOverOver = false;
            }
        }
        */
    
    } else { // not game over
        timeElapsed += timeInterval;
        if (timeElapsed % 1000 == 0) {
            score += 1;
            scoreLabel.attr({text: "score:\n" + score});
        }
        if (timeElapsed % 5000 == 0) {
            var tempBall = new Ball(Math.random() * (width - ballRadius - ballRadius) + ballRadius, 0, ballRadius);
            tempBall.draw();
            tempBall.ball.mousedown(click_event);
            tempBall.hiddenBall.mousedown(click_event);
            balls.push(tempBall);
        }
    }
    for(var i = 0; i < balls.length; i++){
        if (balls[i].y - ballRadius > height) {
            gameOver = true;
            console.log('GAMEOVER');
        }
        if(balls[i].should_bounce_off_wall()){
            balls[i].vx = -balls[i].vx * 0.9;
        }
        balls[i].my_animate();
    }
}, timeInterval);
