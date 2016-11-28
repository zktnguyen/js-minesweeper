$(document).ready(function(){
  var Field = function(x, y){
    this.x = x;
    this.y = y;
    this.isMine = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this._id = y+'-'+x;
    this.mark = '';
    this.adj = [];
    this.adjBombs = 0;
  };

  Field.prototype.setMine = function(bool){
    this.isMine = true;
  };

  Field.prototype.setVal = function(){

  };

  var Board = function(dimensions, numBombs){
    // draw the board given the row and col dimensions
    // plant the mines
    // determines if the game is over
    var board = [];
    var bombs = {};
    this.dimensions = dimensions;
    this.numBombs = numBombs;
  };
    Board.prototype.initBoard = function(){
      var row;


      this.board = [];

      for (var y = 0; y < this.rows; y++){
        row = [];
        this.board.row.push(row);
        for (var x = 0; x < this.cols; x++){
          row.push(new Field(x,y));
        }
      }
      // draw the board
      // assign neighbors
    };

    Board.prototype.drawBoard = function(){
      var tbody = $("<tbody>");
      var tr, td;
      $(".minefield").empty().html(tbody);

      for (var y = 0; y < this.dimensions; y++){
        tr = $('<tr>');
        for (var x = 0; x < this.dimensions; x++){
          td = $('<td data-index="' +y+'-'+x+ '">').html('&nbsp;');
          tr.append(td);
        }
        tbody.append(tr);
      }
      console.log("Creation");
      return this;
    };
    function getRandom(dimensions){
      return Math.floor(Math.random() * 1000 + 1) % dimensions;
    }

    Board.prototype.plantBombs = function(numBombs){
      for (var i = 0; i < numBombs; i++){
          console.log("planting bombs");
      }
    };
  var Game = {
    // deals with everything on the view.
    //Set default values of dimensions, num_bombs
    // Starts a new Game
    // initializes the board
    // triggers the Cheat method by revealing all of the bombs.
    setDefaults: function() {
      $('#dimensions').val(9);
      $('#bombs').val(10);
    },

    start: function() {
      this.dimensions = $('#dimensions').val();
      this.numBombs = $('#bombs').val();
      this.board = new Board(this.dimensions, this.numBombs);
      this.board.drawBoard();
    }

  };
  Game.setDefaults();
  Game.start();
});

// (function($){
//
//
//
// }(jQuery));
