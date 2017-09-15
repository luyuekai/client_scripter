function DashboardViewModel() {
  var self = this;
  self.self_saved_counts = ko.observable();
  self.self_shared_counts = ko.observable();
  self.total_shared_counts = ko.observable();
  self.self_saved_top10= ko.observable();
  self.self_shared_top10= ko.observable();
  self.all_saved_top10= ko.observable();
}
