app.component('main', {
  templateUrl: 'templates/main.html',
  controller: ['$scope', function($scope) {
    var self = this;
    self.type = 'single';
    self.players = [];
  }]
});
