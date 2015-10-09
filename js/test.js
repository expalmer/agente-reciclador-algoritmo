var app = require("./points.js").DoisPontos;
var fs = require("fs");
var file = fs.readFileSync('../ambiente.csv','utf8');


file = file.split('\n')
           .map(function(i,idx) {
              return ( idx !== 0 ? '|' : '') + i;
           })
           .join('');

var origem  = { x: null , y: null };
var destino = { x: null,  y: null };

var ambiente = file
    .split("|")
    .map(function(i){
      return i.split(",");
    })
    .map(function( x, xIndex ) {
      return x.map(function( y, yIndex ) {
                var name  = y === "o" ? null : y;
                var value = { x: xIndex, y:yIndex, name: name };
                if( name === "a" ) origem  = value;
                if( name === "l" ) destino = value;
                return value;
              });
    });

var pontos = new app( origem, destino, ambiente );
var rotas = pontos.getRotas();
var string = rotas
            .filter(function(x) {
              return x;
            })
            .map(function( i ) {
              return i.x + "," + i.y;
            })
            .join("|");

console.log("  add","palmer",string);
