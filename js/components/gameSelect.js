app.component('gameSelect', {
  templateUrl: 'templates/game-select.html',
  bindings: {
    type: '=',
    players: '='
  },
  controller: function($scope, $state) {
    var self = this;
    self.players.length = 0;
    self.offsets = {
      '0': {
        x: 8,
        y: 8
      },
      '1': {
        x: 8,
        y: 37
      },
      '2': {
        x: 37,
        y: 37
      },
      '3': {
        x: 37,
        y: 8
      }
    };
    self.availableOptions = [{
      id: 'single',
      name: 'Single Player'
    }, {
      id: 'multiple',
      name: 'Multiple Player'
    }];
    self.clearPlayers = function() {
      self.players.length = 0;
    }
    self.startGame = function() {
      $state.go('main.board');
    }
    self.addPlayer = function(username) {
      self.players.push({
        id: 'p' + self.players.length,
        username: username,
        pos: 1,
        throws: 0,
        ladders: 0,
        snakes: 0,
        sixes: 0,
        offset: self.offsets[self.players.length]
      });
      self.username = '';
    }
    self.setGameType = function(type) {
      if (type === self.type) {
        return;
      } else {
        self.type = type;
        if (type === 'single') {
          self.clearPlayers();
        }
      }
    }
  }
});
