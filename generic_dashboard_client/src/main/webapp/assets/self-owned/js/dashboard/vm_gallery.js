function BusinessPOJO() {
  var self = this;
  self.isSelf = ko.observable(true);
  self.elements = new ServerPagingViewModel();
}
