app.component('board', {
  templateUrl: 'templates/board.html',
  bindings: {
    players: '='
  },
  controller: function($scope, $state) {
    var self = this;
    self.activePlayerIndex = 0;
    self.activePlayerThrows = 0;

    if (!self.players.length) {
      self.players.push({
        id: 'p0',
        username: 'username',
        pos: 1,
        throws: 0,
        ladders: 0,
        snakes: 0,
        sixes: 0
      })
    }

    self.value = null;
    self.ladders = [{
      start: 5,
      end: 45
    },{
      start: 12,
      end: 15
    },{
      start: 22,
      end: 65
    },{
      start: 2,
      end: 29
    },{
      start: 25,
      end: 99
    }];

    self.snakes = [{
      start: 9,
      end: 1
    },{
      start: 21,
      end: 2
    },{
      start: 55,
      end: 12
    },{
      start: 21,
      end: 12
    },{
      start: 39,
      end: 10
    }];

    self.rollDice = function() {
      self.activePlayerThrows++;
      self.players[self.activePlayerIndex].throws++;
      // console.log(Math.floor((Math.random() * 6) + 1));
      self.value = Math.floor((Math.random() * 6) + 1);
      console.log('dice value', self.value, self.players[self.activePlayerIndex].id);

      // self.updatePos(5, self.players[self.activePlayerIndex]);
      var nextPos = self.getNextPos(self.players[self.activePlayerIndex].pos, self.value);
      // self.updatePos(self.value, self.players[self.activePlayerIndex]);

      if (nextPos === 100) {
        alert('won');
        self.updatePos(100, self.players[self.activePlayerIndex]);
        return;
      } else {
        self.updatePos(nextPos, self.players[self.activePlayerIndex]);
      }

      if (self.value !== 6 || self.activePlayerThrows >= 3) {
        self.activePlayerThrows = 0;
        self.activePlayerIndex++;

        if (self.activePlayerIndex === self.players.length) {
          self.activePlayerIndex = 0;
        }
      } else {
        self.players[self.activePlayerIndex].sixes++;
        console.log('player continues');
        // console.log(self.value);
      }
    }

    self.size = {
      r: 10,
      c: 10
    };
    self.hello = 'hi';

    self.getTimes = function(n) {
      return new Array(n);
    }

    self.getPlayers = function(pos) {
      return self.players.filter(function(e, i, a) {
        return e.pos === pos;
      });
    }

    self.checkIfLadder = function(pos) {
      return self.ladders.find(function(e, i, a) {
        return e.start === pos;
      })
    }

    self.checkIfSnake = function(pos) {
      return self.snakes.find(function(e, i, a) {
        return angular.equals(e.start, pos);
      })
    }

    // if (player.pos.y * 10 + player.pos.x === 99) {
    //   alert('player won');
    //   return;
    //   // player won
    // }

    self.getNewPos = function(prevPos, steps) {
      var newPos = angular.copy(prevPos);

      while (steps) {
        if (newPos.x === 9) {
          newPos.x = 0;
          newPos.y += 1;
        } else {
          newPos.x += 1;
        }

        steps--;
      }

      return newPos;
    }

    self.getNextPos = function(prevPos, steps) {
      return prevPos + steps >= 100 ? 100 : prevPos + steps;
    }

    self.updatePos = function(pos, player) {
      // console.log('newPos', pos);
      player.pos = pos;

      // return;

      var ladder = self.checkIfLadder(pos);

      if (ladder) {
        // console.log('found ladder');
        self.players[self.activePlayerIndex].ladders++;
        self.updatePos(ladder.end, player);
      }

      var snake = self.checkIfSnake(pos);

      if (snake) {
        // console.log('found snake');
        self.players[self.activePlayerIndex].snakes++;
        self.updatePos(snake.end, player);
      }

      return;

      // if (player.pos + steps >= 100) {
      //   // player won put him at dist 100
      // } else {
      //   player.pos += steps;
      //   player.pos.x = player.pos % 10;
      //   player.pos.y = Math.floor(player.pos / 10);
      //   // check for snake and ladder here and update pos again
      // }

      var newPos = self.getNewPos(player.pos, steps);

      if (newPos.y * 10 + newPos.x === 99) {
        alert('player won');
        player.pos = {
          x: 9,
          y: 9
        }
        return;
        // player won
      } else {
        player.pos = newPos
      }

      while (steps) {
        if (player.pos.y * 10 + player.pos.x === 99) {
          alert('player won');
          return;
          // player won
        }

        if (player.pos.x === 9) {
          player.pos.x = 0;
          player.pos.y += 1;
        } else {
          player.pos.x += 1;
        }

        steps--;
      }

      // player.pos = {
      //   x: 3,
      //   y: 0
      // };

      var ladder = self.checkIfLadder(player.pos);

      if (ladder) {
        console.log('ladder');
        self.updatePos(ladder.end, player);
      }
    }

    self.gtgs = function() {
      $state.go('main.gameSelect');
    }
  }
});
