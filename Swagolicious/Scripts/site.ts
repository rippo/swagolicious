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
                width: 12,
                align: 'right',
                chars_preset: 'alphanum',
                timing: 500,
                transform: true
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
                        $('#display1').val("SWAGOLICIOUS").change();
                        $('#display2').val(" SMART DEVS ").change();
                        $('#myModal').modal();
                    } else {
                        var nextWinner = ko.utils.arrayFirst(model.Members(), (item: any)=> item.Id === rawData.Winner.MemberId);

                        model.WinnerShown(true);
                        model.Winner(rawData.Winner.Name);
                        model.WinnerSwagThing(rawData.WonSwag.Thing);
                        model.WinnerPhoto(rawData.Winner.Photo);

                        $('#display1').val(rawData.Winner.PaddedName).change();
                        $('#display2').val(rawData.WonSwag.PaddedName).change();

                        setTimeout(() => {
                            $('#modalNextWinner').modal();
                            setTimeout(() => {
                                nextWinner.WonSwag(true);
                                nextWinner.SwagThing(rawData.WonSwag.TruncatedName);
                            }, 1000);
                        }, 4000);
                    };;
                });
        }

        private MemberViewModel = function (data) {
            var self = this;
            self.Id = data.MemberId;
            self.MemberId = ko.observable(data.MemberId);
            self.Name = ko.observable(data.Name);
            self.Photo = ko.observable(data.Photo);
            self.SwagThing = ko.observable(data.SwagThing);
            self.WonSwag = ko.observable(false);
            self.ApplyPanelClass = ko.computed(() => data.WonSwag || self.WonSwag() ? "panel-primary" : "panel-warning");
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
