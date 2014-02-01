var Swagolicious;
(function (Swagolicious) {
    var Site = (function () {
        function Site() {
            this.MemberModel = function (data) {
                var self = this;
                self.Id = data.MemberId;
                self.MemberId = ko.observable(data.MemberId);
                self.Name = ko.observable(data.Name);
                self.Photo = ko.observable(data.Photo);
                self.SwagThing = ko.observable(data.SwagThing);
                self.WonSwag = ko.observable(false);
                self.ApplyPanelClass = ko.computed(function () {
                    return data.WonSwag || self.WonSwag() ? "panel-primary" : "panel-warning";
                });
            };
            this.ViewModel = function () {
                var vm = this;
                vm.Members = ko.observableArray();
                vm.Winner = ko.observable();
                vm.WinnerSwagThing = ko.observable();
                vm.WinnerPhoto = ko.observable();
                vm.WinnerShown = ko.observable(false);

                vm.RemoveMember = function (member) {
                    $.get("/home/removememberfromgettingswag/" + member.Id).then(function () {
                        vm.Members.remove(member);
                    });
                };

                vm.get = function () {
                    return $.getJSON("/home/memberlist");
                };

                vm.GetNextWinner = function () {
                    Site.prototype.LoadNextWinner(vm);
                };
            };
            this.WireUp();
        }
        Site.prototype.WireUp = function () {
            this.SetUpFlappy();
            this.LoadMembers();
        };

        Site.prototype.SetUpFlappy = function () {
            var options = {
                width: 12,
                align: 'right',
                chars_preset: 'alphanum',
                timing: 500,
                transform: true
            };
            $('#display1').flapper(options).val("SWAGOLICIOUS").change();
            $('#display2').flapper(options).val(" SMART DEVS ").change();
        };

        Site.prototype.LoadMembers = function () {
            var self = this;
            var instance = new this.ViewModel();
            ko.applyBindings(instance);

            $.when(instance.get()).then(function (data) {
                instance.Members(ko.utils.arrayMap(data, function (item) {
                    return new self.MemberModel(item);
                }));
            });
        };

        Site.prototype.LoadNextWinner = function (vm) {
            $('#display2').val("            ").change();

            $.getJSON("/home/nextwinner").then(function (rawData) {
                if (rawData.MemberId == 0) {
                    $('#display1').val("SWAGOLICIOUS").change();
                    $('#display2').val(" SMART DEVS ").change();
                    $('#myModal').modal();
                } else {
                    var nextWinner = ko.utils.arrayFirst(vm.Members(), function (item) {
                        return item.Id === rawData.Winner.MemberId;
                    });

                    vm.WinnerShown(true);
                    vm.Winner(rawData.Winner.Name);
                    vm.WinnerSwagThing(rawData.WonSwag.Thing);
                    vm.WinnerPhoto(rawData.Winner.Photo);

                    $('#display1').val(rawData.Winner.PaddedName).change();
                    $('#display2').val(rawData.WonSwag.PaddedName).change();

                    setTimeout(function () {
                        $('#modalNextWinner').modal();
                        setTimeout(function () {
                            nextWinner.WonSwag(true);
                            nextWinner.SwagThing(rawData.WonSwag.TruncatedName);
                        }, 1000);
                    }, 4000);
                }
                ;
                ;
            });
        };

        Site.prototype.Test = function () {
            console.log("test");
        };
        return Site;
    })();
    Swagolicious.Site = Site;
})(Swagolicious || (Swagolicious = {}));

$(function () {
    var site = new Swagolicious.Site();
});
//# sourceMappingURL=site.js.map
