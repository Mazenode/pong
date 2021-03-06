var game = {
    groundWidth : 700,
    groundHeight : 400,
    groundColor: "#000000",
    netWidth : 6,
    netColor: "#FFFFFF",

    scorePosPlayer1 : 300,
    scorePosPlayer2 : 365,

    wallSound : null,
    playerSound : null,

    divGame : null,

    groundLayer : null,
    scoreLayer : null,
    playersBallLayer : null,

    ball : {
        width : 10,
        height : 10,
        color : "#FFFFFF",
        posX : 200,
        posY : 200,
        speed : 3,
        directionX : 1,
        directionY : 1,
        inGame : false,

        move : function() {
            if ( this.inGame ) {
                this.posX += this.directionX * this.speed;
                this.posY += this.directionY * this.speed;
            }
        },

        bounce : function(soundToPlay) {
            if ( this.posX > game.groundWidth || this.posX < 0 ){
              this.directionX = -this.directionX;
              soundToPlay.play();
            }
            if ( this.posY > game.groundHeight || this.posY < 0 ){
              this.directionY = -this.directionY;
              soundToPlay.play();
            }
        },

        collide : function(anotherItem) {
            if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
            || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height ) ) {
              // Collision
              return true;
            } 
            return false;
        },

        lost : function(player) {
            var returnValue = false;
            if ( player.originalPosition == "left" && this.posX < player.posX - this.width ) {
              returnValue = true;
            } else if ( player.originalPosition == "right" && this.posX > player.posX + player.width ) {
              returnValue = true;
            }
            return returnValue;
        }
    },

    playerOne : {
        width : 10,
        height : 40,
        color : "#FFFFFF",
        posX : 50,
        posY : 200,
        goUp : false,
        goDown : false,
        originalPosition : "left",
        score : 0,
        ai : false
    },
       
    playerTwo : {
        width : 10,
        height : 40,
        color : "#FFFFFF",
        posX : 600,
        posY : 200,
        goUp : false,
        goDown : false,
        originalPosition : "right",
        score : 0,
        ai : true
    },

    init : function() {
        this.divGame = document.getElementById("divGame");

        this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0); 
        game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
        
        this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
        
        this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);  

        this.displayScore(0,0);
        this.displayBall(200,200);
        this.displayPlayers();

        this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);

        this.wallSound = new Audio("./sound/wall.ogg");
        this.playerSound = new Audio("./sound/paddle.ogg");

        game.ai.setPlayerAndBall(this.playerTwo, this.ball);
    },

    initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    },

    initMouse : function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },

    displayScore : function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
    },

    displayBall : function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    },

    displayPlayers : function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
    },

    displayBall : function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    },

    moveBall : function() { 
        this.ball.move();
        this.ball.bounce(this.wallSound);
        this.displayBall();
    },
    
    clearLayer : function(targetLayer) {
        targetLayer.clear();
    },

    movePlayers : function() {
        if ( game.playerOne.goUp ) {
            game.playerOne.posY-=5;
          } else if ( game.playerOne.goDown ) {
            game.playerOne.posY+=5;
          }
    },

    collideBallWithPlayersAndAction : function() { 
        if ( this.ball.collide(game.playerOne) ) {
          game.ball.directionX = -game.ball.directionX;
          this.playerSound.play();
        }
        if ( this.ball.collide(game.playerTwo) ) {
          game.ball.directionX = -game.ball.directionX;
          this.playerSound.play();
        }
    },  

    lostBall : function() {
        if ( this.ball.lost(this.playerOne) ) {
            this.playerTwo.score++;
            this.ball.inGame = false;
             
            if ( this.playerOne.ai ) { 
              setTimeout(game.ai.startBall(), 3000);
            }
          } else if ( this.ball.lost(this.playerTwo) ) {
            this.playerOne.score++;
            this.ball.inGame = false;
         
            if ( this.playerTwo.ai ) { 
              setTimeout(game.ai.startBall(), 3000);
            }
          }
          this.scoreLayer.clear();
          this.displayScore(this.playerOne.score, this.playerTwo.score);
    },
};