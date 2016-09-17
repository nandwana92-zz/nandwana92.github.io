app.component('gameSelect', {
  templateUrl: 'templates/game-select.html',
  bindings: {
    type: '=',
    players: '='
  },
  controller: function($scope, $state) {
    var self = this;
    self.players.length = 0;
    self.availableOptions = [{
      id: 'single',
      name: 'Single Player'
    },{
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
        sixes: 0
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
  // controller: ['$scope', function($scope) {
  //   var self = this;
  //   self.availableOptions = [{
  //     id: 'single',
  //     name: 'Single Player'
  //   },{
  //     id: 'multiple',
  //     name: 'Multiple Player'
  //   }];

  //   self.startGame = function() {
  //     $state.go('main.board');
  //   }
  // }]
});
