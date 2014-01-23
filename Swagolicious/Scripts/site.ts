module Swagolicious {

    export class Site {

        constructor() {
            this.WireUp();
        }


        private WireUp() {
            this.SetUpFlappy();
            this.LoadMembers();
        }

        private SetUpFlappy() {
            var options = {
                width: 12, // number of digits
                align: 'right', // aligns values to the left or right of display
                chars_preset: 'alphanum', // 'num', 'hexnum', 'alpha' or 'alphanum'
                timing: 500,
                transform: true // Flapper automatically detects the jquery.transform
            };
            $('#display1').flapper(options).val("SWAGOLICIOUS").change();
            $('#display2').flapper(options).val(" SMART DEVS ").change();
        }

        private LoadMembers() {
            $.getJSON("/home/memberlist")
                .then(rawData=> ko.utils.arrayMap(rawData, instanceData=> new this.MemberViewModel(instanceData)))
                .done(mappedData=> {
                    this.ApplyBindings(mappedData);
                });
        }

        private ApplyBindings(data) {
            console.log("Applybindings");
            var self = this;
            ko.applyBindings(new self.MasterViewModel(data, self));
        }

        private LoadNextWinner(model) {
            $('#display2').val("            ").change();

            $.getJSON("/home/nextwinner")
                .then(rawData=> {
                    if (rawData.MemberId == 0) {
                        $('#myModal').modal();
                    } else {
                        var nextWinner = ko.utils.arrayFirst(model.Members(), member=> member.Id === rawData.Winner.MemberId);

                        model.WinnerShown(true);
                        model.Winner(rawData.Winner.Name);
                        model.WinnerSwagThing(rawData.WonSwag.Thing);
                        model.WinnerPhoto(rawData.Winner.Photo);

                        $('#display1').val(rawData.Winner.PaddedName).change();
                        $('#display2').val(rawData.WonSwag.PaddedName).change();

                        setTimeout(function () {
                            $(".flipbox").flippy({
                                duration: "600",
                                verso: $('#winnercontainer').html(),
                                onFinish: () => {
                                    nextWinner.WonSwag(true);
                                    nextWinner.SwagThing(rawData.WonSwag.Thing);
                                }
                            });
                        }, 2500);
                    };;
                });
        }

        private MemberViewModel = function (data) {
            if (data.WonSwag)
                console.log("won")
            this.Id = data.MemberId;
            this.MemberId = ko.observable(data.MemberId);
            this.Name = ko.observable(data.Name);
            this.Photo = ko.observable(data.Photo);
            this.SwagThing = ko.observable(data.SwagThing);
            this.WonSwag = ko.observable(false);
            this.ApplyPanelClass = ko.computed(() => data.WonSwag || this.WonSwag() ? "panel-primary" : "panel-warning");
        };

        private MasterViewModel = function (data, self) {
            var vm = this;
            vm.Members = ko.observableArray(data);
            vm.Winner = ko.observable();
            vm.WinnerSwagThing = ko.observable();
            vm.WinnerPhoto = ko.observable();
            vm.WinnerShown = ko.observable(false);

            vm.GetNextWinner = () => {
                self.LoadNextWinner(this);
            };

            vm.RemoveMember = member=> {
                $.get("/home/removememberfromgettingswag/" + member.Id)
                    .then(() => { vm.Members.remove(member); });
            };
        };

    }

}

$(() => {
    var site = new Swagolicious.Site();
});
