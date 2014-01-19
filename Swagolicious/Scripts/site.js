var Swagolicious;
(function (Swagolicious) {
    var Site = (function () {
        function Site() {
            this.DoIt();
        }
        Site.prototype.DoIt = function () {
            var memberViewModel = function memberViewModel(data) {
                var _this = this;
                var self = this;
                self.Id = data.MemberId;
                self.MemberId = ko.observable(data.MemberId);
                self.Name = ko.observable(data.Name);
                self.Photo = ko.observable(data.Photo);
                self.SwagThing = ko.observable(data.SwagThing);
                self.WonSwag = ko.observable(false);
                self.ApplyPanelClass = ko.computed(function () {
                    return _this.WonSwag() ? "panel-primary" : "panel-warning";
                });
            };

            $.getJSON("/home/memberlist").then(function (rawData) {
                return ko.utils.arrayMap(rawData, function (instanceData) {
                    return new memberViewModel(instanceData);
                });
            }).done(function (mappedData) {
                applyBindings(mappedData);
            });

            function applyBindings(data) {
                var masterViewModel = function () {
                    var _this = this;
                    var self = this;
                    self.Members = ko.observableArray(data);
                    self.Winner = ko.observable();
                    self.WinnerSwagThing = ko.observable();
                    self.WinnerPhoto = ko.observable();
                    self.WinnerShown = ko.observable(false);

                    self.GetNextWinner = function () {
                        loadNextWinner(_this);
                    };

                    self.RemoveMember = function (member) {
                        $.get("/home/removememberfromgettingswag/" + member.Id).then(function () {
                            this.Members.remove(member);
                        });
                    };
                };

                ko.applyBindings(new masterViewModel());
            }

            function loadNextWinner(model) {
                $.getJSON("/home/nextwinner").then(function (rawData) {
                    if (rawData.MemberId == 0) {
                        alert("done");
                    } else {
                        var nextWinner = ko.utils.arrayFirst(model.Members(), function (member) {
                            return member.Id === rawData.Winner.MemberId;
                        });

                        model.WinnerShown(true);
                        model.Winner(rawData.Winner.Name);
                        model.WinnerSwagThing(rawData.WonSwag.Thing);
                        model.WinnerPhoto(rawData.Winner.Photo);

                        $(".flipbox").flippy({
                            duration: "600",
                            verso: $('#winnercontainer').html(),
                            onFinish: function () {
                                nextWinner.WonSwag(true);
                                nextWinner.SwagThing(rawData.WonSwag.Thing);
                            }
                        });
                    }
                    ;
                });
            }
        };
        return Site;
    })();
    Swagolicious.Site = Site;
})(Swagolicious || (Swagolicious = {}));

$(function () {
    var site = new Swagolicious.Site();
});
//# sourceMappingURL=site.js.map
