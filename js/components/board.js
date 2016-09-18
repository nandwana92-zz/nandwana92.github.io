app.component('board', {
  templateUrl: 'templates/board.html',
  bindings: {
    players: '='
  },
  controller: function($scope, $state, $interval, $timeout) {
    var self = this;
    var stop;
    self.activePlayerIndex = 0;
    self.activePlayerThrows = 0;
    self.diceRolling = false;
    self.playerMoving = false;
    self.showSnakeBg = false;
    self.showLadderBg = false;
    self.diceValue = null;
    self.game = {
      status: 'inProgress',
      winningPlayer: null
    }
    if (!self.players.length) {
      self.players.push({
        id: 'p1',
        username: 'usernaam',
        pos: 1,
        throws: 0,
        ladders: 0,
        snakes: 0,
        sixes: 0,
        offset: {
          x: 8,
          y: 37
        }
      })
    }
    self.ladders = [{
      start: 5,
      end: 100
    }, {
      start: 3,
      end: 99
    }, {
      start: 9,
      end: 95
    }, {
      start: 2,
      end: 89
    }, {
      start: 4,
      end: 99
    }];
    self.ladders = [{
      start: 5,
      end: 45
    }, {
      start: 12,
      end: 15
    }, {
      start: 22,
      end: 65
    }, {
      start: 2,
      end: 29
    }, {
      start: 25,
      end: 99
    }];
    self.snakes = [{
      start: 9,
      end: 1
    }, {
      start: 21,
      end: 2
    }, {
      start: 55,
      end: 12
    }, {
      start: 21,
      end: 12
    }, {
      start: 39,
      end: 10
    }];
    self.rollDice = function() {
      self.startDiceAnimation();
      $timeout(function() {
        self.stopDiceAnimation();
        self.activePlayerThrows++;
        self.players[self.activePlayerIndex].throws++;
        self.diceValue = Math.floor((Math.random() * 6) + 1);
        var nextPos = self.getNextPos(self.players[self.activePlayerIndex].pos, self.diceValue);
        if (nextPos === 100) {
          self.game.status = 'complete';
          self.game.winningPlayer = self.players[self.activePlayerIndex];
          self.updatePos(100, self.players[self.activePlayerIndex]);
          return;
        } else {
          self.updatePos(nextPos, self.players[self.activePlayerIndex]);
        }
        if (self.diceValue !== 6 || self.activePlayerThrows >= 3) {
          self.activePlayerThrows = 0;
          self.activePlayerIndex++;
          if (self.activePlayerIndex === self.players.length) {
            self.activePlayerIndex = 0;
          }
        } else {
          self.players[self.activePlayerIndex].sixes++;
        }
      }, 1000);
    }
    self.size = {
      r: 10,
      c: 10
    };
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
      player.pos = pos;
      self.disableDice();
      var ladder = self.checkIfLadder(pos);
      if (ladder) {
        self.showLadderBg = true;
        self.players[self.activePlayerIndex].ladders++;
        $timeout(function() {
          self.updatePos(ladder.end, player);
          self.showLadderBg = false;
        }, 1000);
      }
      var snake = self.checkIfSnake(pos);
      if (snake) {
        self.showSnakeBg = true;
        self.players[self.activePlayerIndex].snakes++;
        $timeout(function() {
          self.updatePos(snake.end, player);
          self.showSnakeBg = false;
        }, 1000);
      }
    }
    self.goToGameSelect = function() {
      $state.go('main.gameSelect');
    }
    self.startDiceAnimation = function() {
      self.diceRolling = true;
      stop = $interval(function() {
        self.randomDiceImg = 'images/dice' + Math.floor((Math.random() * 6) + 1).toString() + '.svg';
      }, 100);
    }
    self.stopDiceAnimation = function() {
      self.diceRolling = false;
      $interval.cancel(stop);
    }
    self.getPugPos = function(player) {
      var x = (player.pos - 1) % 10;
      var y = Math.floor((player.pos - 1) / 10);
      return {
        'left': (player.offset.x + (72 * (x) + 1)).toString() + 'px',
        'bottom': (player.offset.y + (72 * (y) + 1)).toString() + 'px'
      }
    }
    self.disableDice = function() {
      self.playerMoving = true;
      $timeout(function() {
        self.playerMoving = false;
      }, 1000)
    }
  }
});
