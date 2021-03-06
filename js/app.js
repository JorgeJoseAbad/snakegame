//constructor del tablero de juego y del juego

function Game(options) {
  this.rows    = options.rows;
  this.columns = options.columns;
  this.snake   = options.snake;
  this.food    = undefined;
  this.points  = 0;

  for (var rowIndex = 0; rowIndex < options.rows; rowIndex++){
    for (var columnIndex = 0; columnIndex < options.columns; columnIndex++){
      $('.container').append($('<div>')
        .addClass('cell board')
        .attr('data-row', rowIndex)
        .attr('data-col', columnIndex)
      );
    }
  }
  this.drawSnake();
  this.generateFood();
  this.drawFood();
  this.assignControlsToKeys();
  this.start();

}
//comienza el juego setInterval llama repetidamente a una funcion con un delay
Game.prototype.start = function(){
  if (!this.intervalId){
    this.intervalId = setInterval(this.update.bind(this), 100);
  }
};

//retira la clase snake de las posiciones que la tengan, para poder luego
//dibujar la serpiente en las nuevas posiciones
Game.prototype.clearSnake = function() {
  $('.snake').removeClass('snake');
};

//dibuja la serpiente, por cada elemento de la serpiente, asigna su posicon a la
//clase serpiente lo que visualmente hace cambiar su color...
Game.prototype.drawSnake = function() {
  this.snake.body.forEach( function(position, index) {
    // recordar la sintaxis de selectores CSS
    var selector = '[data-row=' + position.row + '][data-col=' + position.column + ']';
    $(selector).addClass('snake');
  });
};

//controla toda la dinamica de movimiento: mueve adelante, comprueba si ha comido o
//se ha comido, y redibuja la serpiente
Game.prototype.update = function(){
  this.snake.moveForward(this.rows, this.columns);

  if (this.snake.hasEatenFood(this.food)){
    this.snake.grow();
    this.clearFood();
    this.generateFood();
    this.drawFood();
  }

  if (this.snake.hasEatenItself()){
    alert('Game Over');
    this.readPoints();
    this.stop();
  }

  this.clearSnake();
  this.drawSnake();
};

//asigna controles a las teclas con bind a this (el juego)
Game.prototype.assignControlsToKeys = function(){
  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 38: // arrow up
        this.snake.goUp();
        break;
      case 40: // arrow down
        this.snake.goDown();
        break;
      case 37: // arrow left
        this.snake.goLeft();
        break;
      case 39: // arrow right
        this.snake.goRight();
        break;
      case 80: // p letter
      //this.intervalID es el tiempo entre intervalos de 100 que ha retornado this.setInterval
          if (this.intervalId) {
            this.stop();
          } else {
            this.start();
          }
        break;
    }
  }.bind(this));
};


Game.prototype.stop = function(){
  if (this.intervalId){
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }
};

//retira la clase food del lugar donde este llamada cuando la serpiente
//pasa por encima
Game.prototype.clearFood = function(){
  $(".food").removeClass('food');
  this.food = undefined;
};


//una vez generada la comida, la pinta cambiando la clase de la posicion donde ha caido
Game.prototype.drawFood = function(){
  var selector = '[data-row=' + this.food.row + '][data-col=' + this.food.column + ']';
  $(selector).addClass('food');
};

//genera comida en posicion aleatoria y comprueba que no cae sobre la serpiente
Game.prototype.generateFood = function() {
  do {
    this.food = {
      row: Math.floor(Math.random() * this.rows),
      column: Math.floor(Math.random() * this.columns)
    };
  } while (this.snake.collidesWith(this.food));
};

Game.prototype.readPoints = function(){
  this.points=this.snake.body.length;
  $('#result').html("<h2> Puntos: "+
          this.points+"</h2>");
}

/* Variable que crea el juego, con las opciones que pasa al constructor,
 que incluyen la snake definida en otro fichero */
var game = new Game({
  rows: 50,
  columns: 50,
  snake: new Snake()
});
