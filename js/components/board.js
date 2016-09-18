app.component('board', {
  templateUrl: 'templates/board.html',
  bindings: {
    players: '=',
    type: '='
  },
  controller: function($scope, $state, $interval, $timeout) {
    var self = this;
    var stop;
    self.currentPlayer = self.nextPlayer = self.players[0];
    self.currentPlayerIndex = 0;
    self.currentPlayerThrows = 0;
    self.diceRolling = false;
    self.playerMoving = false;
    self.showSnakeBg = false;
    self.showLadderBg = false;
    self.diceValue = null;
    self.game = {
      status: 'inProgress',
      winningPlayer: null
    }
    self.ladders = [{
      start: 4,
      end: 14
    }, {
      start: 9,
      end: 31
    }, {
      start: 20,
      end: 38
    }, {
      start: 51,
      end: 66
    }, {
      start: 63,
      end: 81
    }, {
      start: 71,
      end: 91
    }, {
      start: 28,
      end: 84
    }, {
      start: 40,
      end: 59
    }];
    self.snakes = [{
      start: 17,
      end: 7
    }, {
      start: 62,
      end: 19
    }, {
      start: 87,
      end: 24
    }, {
      start: 54,
      end: 34
    }, {
      start: 64,
      end: 60
    }, {
      start: 48,
      end: 23
    }, {
      start: 93,
      end: 73
    }, {
      start: 99,
      end: 78
    }];
    self.changePlayer = function() {
      if (self.diceValue !== 6 || self.currentPlayerThrows >= 3) {
        if (self.currentPlayerIndex + 1 === self.players.length) {
          self.nextPlayer = self.players[0];
          self.currentPlayerIndex = 0;
        } else {
          self.nextPlayer = self.players[++self.currentPlayerIndex];
        }
        self.currentPlayerThrows = 0;
      } else {
        self.currentPlayer.sixes++;
      }
      if (self.type === 'single' && self.nextPlayer.id === 'c') {
        self.rollDice();
      }
    }
    self.rollDice = function() {
      self.startDiceAnimation();
      self.currentPlayerThrows++;
      self.currentPlayer.throws++;
      $timeout(function() {
        self.currentPlayer = self.nextPlayer;
        self.diceValue = Math.floor((Math.random() * 6) + 1);
        self.stopDiceAnimation();
        var nextPos = self.getNextPos(self.currentPlayer.pos, self.diceValue);
        if (nextPos === 100) {
          self.game.status = 'complete';
          self.game.winningPlayer = self.currentPlayer;
          self.updatePos(100, self.currentPlayer);
          return;
        } else {
          self.updatePos(nextPos, self.currentPlayer);
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
      var snake = self.checkIfSnake(pos);
      if (snake || ladder) {
        if (ladder) {
          self.showLadderBg = true;
          player.ladders++;
          $timeout(function() {
            self.updatePos(ladder.end, player);
            self.showLadderBg = false;
          }, 1000);
        }
        if (snake) {
          self.showSnakeBg = true;
          player.snakes++;
          $timeout(function() {
            self.updatePos(snake.end, player);
            self.showSnakeBg = false;
          }, 1000);
        }
      } else {
        $timeout(function() {
          self.changePlayer();
        }, 1000)
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
