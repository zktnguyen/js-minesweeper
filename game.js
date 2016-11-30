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
    var td = $('.minefield').find('td[id="' + this.el_id + '"]');
    td.removeClass("flag");
    switch(val){
      case "!":
        td.addClass("flag");
        break;
      case "?":
        td.addClass("flag");
        break;
      case "*":
        td.addClass("mine");
        break;
      case "&nbsp;":
        td.removeClass("flag");
        break;
      default:
        td.addClass("empty");
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
    if (this.isMine) return;
    this.setRevealed(true);
    this.setText(this.adjMines);
    if (this.adjMines === 0){
      $.each(this.getAdj(), function(key, adj){
        if (!adj.isRevealed){
          adj.reveal();
        }
      });
    }
  };

  var Board = function(dimensions, numMines){
    // builds the board array
    // plants the mines
    // connects all the fields (makes adjacency array)

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
    this.connectFields();
  };

    Board.prototype.connectFields = function(){
      for (var x = 0; x < this.dimensions; x++){
        for (var y = 0; y < this.dimensions; y++){
          var curField = this.getField(x, y);
          this.setAdjacent(curField);
        }
      }
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
          console.log("mine planted: " + x + '-' + y);
        }
      }
    };

    Board.prototype.getField = function(x,y){
      return this.board[y][x];
    };

    Board.prototype.setAdjacent = function(field){
      var result = [], x = field.x, y=field.y;
      var curField = this.getField(x,y);
      for(var i=x-1; i<=x+1; i++ ) {
        if(i<0 || i>=this.dimensions)  continue;
        for(var j=y-1; j<=y+1; j++) {
          if(j<0 || j>=this.dimensions) continue;
          if(y===j && x===i) continue;
          curField.setAdj(this.getField(i,j));
        }
      }

    };

    Board.prototype.clickField = function(e){
      var index = $(e.target).attr('id').split('-');
      var x = Number(index[1]);
      var y = Number(index[0]);
      return this.getField(x,y);
    };

    Board.prototype.reveal = function(field){
      if (field.isRevealed) return;
      if (field.isMine){
        this.revealMines();
        Minesweeper.over("lose");
      }
      else {
        field.reveal();
        this.covered();
      }
    };

    Board.prototype.covered = function(){
      var num_uncovered = 0;
      for (var x = 0; x < this.dimensions; x++){
        for (var y= 0; y < this.dimensions; y++){
          var field = this.getField(x, y);
          if (!field.isRevealed && !field.isMine){
            num_uncovered++;
          }
        }
      }
      if (!num_uncovered){
        Minesweeper.over("won");
      }
    };

    Board.prototype.revealMines = function(){
      for (var x = 0; x < this.dimensions; x++){
        for (var y = 0; y < this.dimensions; y++){
          var field = this.getField(x,y);
          if(field.isMine) field.setText("*");
        }
      }
    };
  var Minesweeper = {
    // deals with everything on the view.
    //Set default values of dimensions, num_mines
    // Starts a new Game
    // initializes the board
    // interacts with the buttons (New Game, Reveal Mines)
    done: false,
    time: 0,
    board: {},
    over: function(result){
      this.done = true;
      this.board.revealMines();
      if (result === "lose"){
        $("#status").removeClass("ui disabled label").addClass("ui huge header").html("You lost!");
      }
      else if (result === "won"){
        $("#status").removeClass("ui disabled label").addClass("ui huge header").html("You won!");
      }
    },
    setDifficulty: function() {
      $('#dimensions').val(9);
      $('#mines').val(10);
    },

    start: function() {
      var dimensions = $('#dimensions').val();
      var numMines = $('#mines').val();
      this.board = new Board(dimensions,numMines);
      this.board.drawBoard(dimensions);
    }

  };


  Minesweeper.setDifficulty();
  Minesweeper.start();
  $(".minefield").click(function(e){
    if (!Minesweeper.done){
      var field = Minesweeper.board.clickField(e);
      Minesweeper.board.reveal(field);
    }

    return false;
  });

  $(".minefield").bind('contextmenu rightclick', function(e){
    e.preventDefault();
    console.log($(e.target));
    // flag the current td
    if (!Minesweeper.done){
      var field = Minesweeper.board.clickField(e);
      field.flagField();
    }
    return false;
  });

  $("#reveal").click(function(e){
    e.preventDefault();
    if (!Minesweeper.done){
      Minesweeper.board.revealMines();
    }
  });

  $("#new-game").click(function(e){
    e.preventDefault();
    confirm("Start new game?");
    Minesweeper.start();
  });
});
