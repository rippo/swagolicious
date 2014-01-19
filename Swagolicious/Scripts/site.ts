module Swagolicious {

    export class Site {

        constructor() {
            this.DoIt();
        }

        private DoIt() {
            var memberViewModel = function memberViewModel(data) {
                var self = this;
                self.Id = data.MemberId;
                self.MemberId = ko.observable(data.MemberId);
                self.Name = ko.observable(data.Name);
                self.Photo = ko.observable(data.Photo);
                self.SwagThing = ko.observable(data.SwagThing);
                self.WonSwag = ko.observable(false);
                self.ApplyPanelClass = ko.computed(()=> this.WonSwag() ? "panel-primary" : "panel-warning");
            };

            $.getJSON("/home/memberlist")
                .then(rawData=> ko.utils.arrayMap(rawData, instanceData=> new memberViewModel(instanceData)))
                .done(mappedData=> {
                applyBindings(mappedData);
            });

            function applyBindings(data) {
                var masterViewModel = function () {
                    var self = this;
                    self.Members = ko.observableArray(data);
                    self.Winner = ko.observable();
                    self.WinnerSwagThing = ko.observable();
                    self.WinnerPhoto = ko.observable();
                    self.WinnerShown = ko.observable(false);

                    self.GetNextWinner = ()=> {
                        loadNextWinner(this);
                    };

                    self.RemoveMember = member=> {
                        $.get("/home/removememberfromgettingswag/" + member.Id)
                            .then(function () {
                                this.Members.remove(member);
                            });
                    };
                };

                ko.applyBindings(new masterViewModel());
            }

            function loadNextWinner(model) {

                $.getJSON("/home/nextwinner")
                    .then(rawData=> {
                    if (rawData.MemberId == 0) {
                        alert("done");
                    } else {
                        var nextWinner = ko.utils.arrayFirst(model.Members(), member=> member.Id === rawData.Winner.MemberId);

                        model.WinnerShown(true);
                        model.Winner(rawData.Winner.Name);
                        model.WinnerSwagThing(rawData.WonSwag.Thing);
                        model.WinnerPhoto(rawData.Winner.Photo);

                        $(".flipbox").flippy({
                            duration: "600",
                            verso: $('#winnercontainer').html(),
                            onFinish: ()=> {
                                nextWinner.WonSwag(true);
                                nextWinner.SwagThing(rawData.WonSwag.Thing);
                            }
                        });
                    };
                });
            }
            
        }

    }

}

$(()=> {
    var site = new Swagolicious.Site();
});
