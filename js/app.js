var app = angular.module('kredx', ['ui.router']);

app.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main', {
    url: '/main',
    template: '<main></main>'
  });

  $stateProvider.state('main.gameSelect', {
    url: '/game-select',
    template: '<game-select type="$ctrl.type" players="$ctrl.players"></game-select>'
  });

  $stateProvider.state('main.board', {
    url: '/board',
    template: '<board players="$ctrl.players"></board>'
  });
}]);
