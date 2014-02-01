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
            var self = this;
            var instance = new this.ViewModel();
            ko.applyBindings(instance);

            $.when(instance.get()).then(data=> {
                instance.Members(ko.utils.arrayMap(data, item=> {
                    return new self.MemberModel(item);
                }));
            });
        }


        private LoadNextWinner(vm) {
            $('#display2').val("            ").change();

            $.getJSON("/home/nextwinner")
                .then(rawData=> {
                    if (rawData.MemberId == 0) {
                        $('#display1').val("SWAGOLICIOUS").change();
                        $('#display2').val(" SMART DEVS ").change();
                        $('#myModal').modal();
                    } else {
                        var nextWinner = ko.utils.arrayFirst(vm.Members(), (item: any) => item.Id === rawData.Winner.MemberId);

                        vm.WinnerShown(true);
                        vm.Winner(rawData.Winner.Name);
                        vm.WinnerSwagThing(rawData.WonSwag.Thing);
                        vm.WinnerPhoto(rawData.Winner.Photo);

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

        private MemberModel = function (data) {
            var self = this;
            self.Id = data.MemberId;
            self.MemberId = ko.observable(data.MemberId);
            self.Name = ko.observable(data.Name);
            self.Photo = ko.observable(data.Photo);
            self.SwagThing = ko.observable(data.SwagThing);
            self.WonSwag = ko.observable(false);
            self.ApplyPanelClass = ko.computed(() => data.WonSwag || self.WonSwag() ? "panel-primary" : "panel-warning");
        };

        private Test() {
            console.log("test");
        }

        private ViewModel = function () {
            var vm = this;
            vm.Members = ko.observableArray();
            vm.Winner = ko.observable();
            vm.WinnerSwagThing = ko.observable();
            vm.WinnerPhoto = ko.observable();
            vm.WinnerShown = ko.observable(false);

            vm.RemoveMember = member=> {
                $.get("/home/removememberfromgettingswag/" + member.Id)
                    .then(() => { vm.Members.remove(member); });
            };

            vm.get = () => $.getJSON("/home/memberlist");

            vm.GetNextWinner = () => {
                Site.prototype.LoadNextWinner(vm);
            };
        };

    }
}

$(() => {
    var site = new Swagolicious.Site();
});



