//constructor con posición y tamaño inicial y direccion inicial
function Snake(options){
  this.direction='right';
  this.body=[
    {row:1, column:5},
    {row:1, column:4},
    {row:1, column:3},
    {row:1, column:2},
    {row:1, column:1},
  ];
}

//definimos funciones de direccion de movimiento dependiendo de la direccion actual
Snake.prototype.goLeft = function() {
  if (this.direction === 'up' || this.direction === 'down'){
    this.direction = 'left';
  }
};

Snake.prototype.goRight = function() {
  if (this.direction === 'up' || this.direction === 'down'){
    this.direction = 'right';
  }
};

Snake.prototype.goUp = function() {
  if (this.direction === 'left' || this.direction === 'right'){
    this.direction = 'up';
  }
};

Snake.prototype.goDown = function() {
  if (this.direction === 'left' || this.direction === 'right'){
    this.direction = 'down';
  }
};


//funcion para mover la serpiente dependiendo de la direccion actual
//se añade al principio de la serpiente, segun la direccion que tiene,
//y se retira del final
Snake.prototype.moveForward = function(maxRows, maxColumns) {
  var head = this.body[0];

  switch(this.direction){
    case 'up':
      this.body.unshift({
        row: (head.row - 1 + maxRows ) % maxRows,
        column: head.column
      });
      break;
    case 'down':
      this.body.unshift({
        row: (head.row + 1) % maxRows,
        column: head.column
      });
      break;
    case 'left':
      this.body.unshift({
        row: head.row,
        column: (head.column - 1 + maxColumns) % maxColumns
      });
      break;
    case 'right':
      this.body.unshift({
        row: head.row,
        column: (head.column + 1) % maxColumns
      });
      break;
  }
  //para retirar del final de la serpiente
  //this.body.pop();
  this.previousTail = this.body.pop(); //almacenamos la cola para luego volver
  //a añadirla (si la serpiente crece)
};

//si la cabeza de la serpiente coincide con la comida retorna true
Snake.prototype.hasEatenFood = function(foodPosition){
  return this.body[0].row === foodPosition.row &&
  this.body[0].column === foodPosition.column;
};

//comprueba si la cabeza esta en contacto con alguna otra parte del cuerpo
//usa some method
Snake.prototype.hasEatenItself = function(){
  return this.body.some(function (element, index, array) {
    return (element.row === array[0].row &&
      element.column === array[0].column &&
      index !== 0); //poner siempre !== para comprobar desigualdad
  });
};

//cmprueba que o si la comida no cae sobre la serpiente
Snake.prototype.collidesWith = function(position){
  return this.body.some(function (element){
    return element.row === position.row &&
    element.column === position.column;
  });
};

//crece añadiendo un elemento de nuevo a la cola tras el movimiento
Snake.prototype.grow = function(){
  if (this.previousTail){
    this.body.push(this.previousTail);
    this.previousTail = undefined;
  }
};
