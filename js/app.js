;(function(context){

  'use strict';

  var COUNT = 0;

  function App() {

    this.$command = $('#command');
    this.$output = $('#output');
    this.$grid = $('#grid');
    this.$terminal = $('#terminal');

    this.$command.focus();

    this.algoritmos = {};

    this.ambiente  = [];
    this.criarAmbiente();
    this.render();
    this.addEventListeners();
  }

  App.fn = App.prototype;

  App.fn.addEventListeners = function () {
    var self = this;

    this.$grid.on('click','.col', function() {
      var ele = $(this);
      var x = ele.data('x');
      var y = ele.data('y');
      var v = ele.data('v');
      self.addElementos( x, y, v );
    });

    this.$command.on('keypress', function(e) {
      if( e.charCode === 13 ) {
        this.commandLine( e.target.value );
      }
    }.bind(this));

  };

  App.fn.criarAmbiente = function () {
    var tam = 10;
    this.ambiente = Array.apply(0, Array(tam) ).map( function ( a, x ) {
      return Array.apply(0, Array(tam) ).map( function( b, y ) {
          return "o";
        });
      });
  };

  App.fn.commandLine = function ( value ) {

    var output = [];
    var clear = false;

    var data;

    // help
    if( value === "help" ) {
      output.push("<span class='green'>export [csv | string]</span> para exportar o ambiente");
      output.push("<span class='green'>import [nome] [string]</span> para importar o algoritmo");
      output.push("<span class='green'>list</span> para listar os algoritmos");
      output.push("<span class='green'>exec [nome]</span> para executar um algoritmo");
      clear = true;
    }


    // Add
    if( value.indexOf("add ") > -1  ) {
      data = value.split("add ")[1];
      this.addAlgoritmos( data );
      output.push( "<span class='green'> Added </span>" );
      clear = true;
    }

    // Exec
    if( value.indexOf("exec ") > -1 ) {
      output.push( this.moveAgente( value ) );
      clear = true;
    }

    // Log
    if( value.indexOf("log ") > -1 ) {
      output.push( "<span class='green'> " + value.split("log ")[1] + "</span>" );
    }

    // Import
    if( value.indexOf("import ") > -1  ) {
      data = value.split("import ")[1];
      output.push( this.setAmbiente(data) );
      clear = true;
    }

    // Export
    if( value.indexOf("export ") > -1  ) {
      data = value.split("export ")[1];
      output.push( this.getFile(data) );
      clear = true;
    }

    // List
    if( value.indexOf("list") > -1  ) {
      _.each(this.algoritmos, function( v, k ) {
          output.push( "<span class='green'> " + k + " </span>" );
        });
        output = output.length > 0 ? output : ["<span class='red'> sem algoritmos ainda </span>"];
      clear = true;
    }

    this.$command.val('');

    if ( clear ) {
      this.$output.html('');
    }

    if( output ) {
      this.$output.prepend(
          output.map(function( i ){
            return '<div>' + i + '</div>';
          })
      );
    }

  };

  App.fn.addAlgoritmos = function ( value ) {

    var aux = value.split(" ");
    var name = aux[0];
    var func = aux[1];

    var coor = func.split('|')
      .map(function( i ) {
        return i.split(',');
      });

    this.algoritmos[ name ] = coor;

  };

  App.fn.moveAgente = function ( value, callback ) {

    var name = value.split(' ')[1];
    if( typeof this.algoritmos[name] === 'undefined' ) {
      return "<span class='red'>'"+ name +"'</span> nao encontrada";
    }
    var agente = this.getAgenteCoor();
    if( _.isEmpty(agente) ) {
      return "<span class='red'>coloque o agente no ambiente</span>";
    }
    var delay = 500;
    var time  = 0;
    var count = 0;
    var move = function ( prev, next ) {
      if ( next[0] && next[1] ) {
        this.ambiente[prev[0]][prev[1]] = "o";
        this.ambiente[next[0]][next[1]] = "a";
        count++;
        this.commandLine('log [ '+next[0]+','+next[1]+' ] => ' + count );
      } else {
        this.ambiente[prev[0]][prev[1]] = "a";
      }

      this.render();
    };

    this.render();

    this.algoritmos[name]
      .reduce( function( acc, curr) {
          time += delay
          setTimeout( move.bind(this, acc, curr), time );
          return curr;
        }.bind(this), [ agente.x, agente.y ] );

    return "<span class='green>Andando...</span>";

  };

  App.fn.getAgenteCoor = function () {
    var agente = {};
    _.each(this.ambiente, function ( x, idxX ) {
      _.each( x, function( y, idxY ) {
        if ( y === "a" ) {
          agente = { x: idxX, y: idxY };
        }
      });
    });
    return agente;
  };

  App.fn.setAmbiente = function ( data ) {

    var self = this;
    data = data.split(" ");
    data.map(function( x, xIndex ) {
      return x.split(',')
              .map(function( y, yIndex ) {
                self.ambiente[xIndex][yIndex] = y;
                return { x: xIndex, y: yIndex };
              });
    });

    this.render();

    return "<span class='green'>Imported</span>";

  };

  App.fn.getFile = function ( file ) {

    var sep = file === "csv" ? "<br />" : "|";
    var res = '';
    _.each(this.ambiente, function(x) {
      var arr = [];
      _.each( x, function (y) {
        arr.push( y );
      });
      res += arr.join(",") + sep;
    });
    return res;
  };

  App.fn.addElementos = function( x, y, v ) {

    if( COUNT === 0 || v === 'a' ) {
      if( v === 'a' ) {
        this.ambiente[x][y] = 'o';
        COUNT = 0;
      } else {
        this.ambiente[x][y] = 'a';
        COUNT = 1;
      }
    } else if ( COUNT === 1 || v === 'l' ) {
      if( v === 'l' ) {
        this.ambiente[x][y] = 'o';
        COUNT = 1;
      } else {
        this.ambiente[x][y] = 'l';
        COUNT = 2;
      }
    } else {
      if( v === 'x' ) {
        this.ambiente[x][y] = 'o';
      } else {
        this.ambiente[x][y] = 'x';
      }
    }

    this.render();

  };

  App.fn.render = function () {

    var html = [];
    _.each( this.ambiente, function(x, ix){
      html.push('<div class="row">');
      _.each(x, function(y,iy){
        html.push( '<div class="col" data-x="'+ix+'" data-y="'+iy+'" data-v="'+ y +'"><span class="' + y +'"></span></div>' );
      });
      html.push('</div>');
    });
    this.$grid.html(html.join(""));

  };

  context.App = App;

})(this);