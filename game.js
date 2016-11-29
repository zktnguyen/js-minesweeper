$(document).ready(function(){
  var Field = function(x, y){
    this.x = x;
    this.y = y;
    this.isMine = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.el_id = y+'-'+x;
    this.text = '';
    this.adj = [];
    this.adjMines = 0;
  };

  Field.prototype.setMine = function(bool){
    this.isMine = bool;
    return this;
  };

  Field.prototype.setFlagged = function(bool){
    this.isFlagged = bool;
    return this;
  };

  Field.prototype.setRevealed = function(bool){
    this.isRevealed = bool;
    if (this.isMine) this.isRevealed = true;
    return this;
  };

  // sets the mark of the field as a mine or flagged
  Field.prototype.setText = function(val){
    var td = $('.minefield').find('<td id="' + this.el_id + '">');
    td.removeClass("flag");
    switch(val){
      case "!":
        break;
      case "?":
        td.addClass("flag");
        break;
      case "X":
        td.addClass("mine");
        break;
    }
    td.html(val);
    return this;
  };

  Field.prototype.flagField = function(){
    if (this.isRevealed) return;
    switch(this.text){
      case "!":
        this.text = "";
        break;
      case "?":
        this.text = "!";
        break;
      case "":
        this.text = "?";
        break;
      }
    this.setText(this.text || "&nbsp;");
    return this;
  };

  Field.prototype.setAdj = function(field){
    this.adj.push(field);
    if(field.isMine) this.adjMines++;
    return this;
  };

  Field.prototype.getAdj = function(){
    return this.adj;
  };

  Field.prototype.reveal = function(){
    return this.adjMines || this.isMine;
  };

  var Board = function(dimensions, numMines){
    // draw the board given the row and col dimensions
    // plant the mines
    // determines if the game is over
    var row;
    this.board = [];
    this.dimensions = dimensions;
    for (var y = 0; y < dimensions; y++){
      row = [];
      this.board.push(row);
      for (var x = 0; x < dimensions; x++){
        row.push(new Field(x,y));
      }
    }
    this.plantMines(numMines, dimensions);
  };

    Board.prototype.drawBoard = function(dimensions){
      var tbody = $("<tbody>");
      var tr, td;
      $(".minefield").empty().html(tbody);
      for (var y = 0; y < dimensions; y++){
        tr = $('<tr>');
        for (var x = 0; x < dimensions; x++){
          td = $('<td id="' +y+'-'+x+ '">').html('&nbsp;');
          tr.append(td);
        }
        tbody.append(tr);
      }
      return this;
    };

    function getRandom(dimensions){
      return Math.floor(Math.random() * 1000 + 1) % dimensions;
    }

    Board.prototype.plantMines = function(numMines, dimensions){
      var mines = 0;
      while(mines < numMines){
        var x = getRandom(dimensions);
        var y = getRandom(dimensions);
        if (!this.board[x][y].isMine){
          this.board[x][y].setMine(true);
          mines++;
        }
      }
    };

    Board.prototype.setAdjacent = function(field){
      var result = [], x = field.x, y=field.y;
      for (var i = x-1; i < x+1; i++){
        if (i < 0 || i >= this.dimensions) continue;
        for (var j = y-1; j < y+1; x++){
          if (j < 0 || j >= this.dimensions) continue;
          if (y === j && x === i) continue;
          result.push(this.getCell(i, j));
        }
      }
      return result;
    };

    Board.prototype.getField = function(x,y){
      return this.board[y][x];
    };

  var Minesweeper = {
    // deals with everything on the view.
    //Set default values of dimensions, num_mines
    // Starts a new Game
    // initializes the board
    // interacts with the buttons (New Game, Reveal Mines)
    done: false,
    timeElapsed: 0,
    complete: function(){
      this.done = true;

    },
    setDefaults: function() {
      $('#dimensions').val(9);
      $('#mines').val(10);
    },

    start: function() {
      var dimensions = $('#dimensions').val();
      var numMines = $('#mines').val();
      var board = new Board(dimensions,numMines);
      board.drawBoard(dimensions);
    }
  };


  Minesweeper.setDefaults();
  Minesweeper.start();
  $(".minefield").click(function(e){
    console.log($(e.target));
    return false;
  });

  $(".minefield").bind('contextmenu rightclick', function(e){
    e.preventDefault();
    console.log($(e.target));
    return false;
  });
});

// (function($){
//
//
//
// }(jQuery));
