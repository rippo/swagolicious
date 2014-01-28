var Swagolicious;
(function (Swagolicious) {
    var Site = (function () {
        function Site() {
            this.MemberViewModel = function (data) {
                var _this = this;
                this.Id = data.MemberId;
                this.MemberId = ko.observable(data.MemberId);
                this.Name = ko.observable(data.Name);
                this.Photo = ko.observable(data.Photo);
                this.SwagThing = ko.observable(data.SwagThing);
                this.WonSwag = ko.observable(false);
                this.ApplyPanelClass = ko.computed(function () {
                    return data.WonSwag || _this.WonSwag() ? "panel-primary" : "panel-warning";
                });
            };
            this.MasterViewModel = function (data, self) {
                var _this = this;
                var vm = this;
                vm.Members = ko.observableArray(data);
                vm.Winner = ko.observable();
                vm.WinnerSwagThing = ko.observable();
                vm.WinnerPhoto = ko.observable();
                vm.WinnerShown = ko.observable(false);

                vm.GetNextWinner = function () {
                    self.LoadNextWinner(_this);
                };

                vm.RemoveMember = function (member) {
                    $.get("/home/removememberfromgettingswag/" + member.Id).then(function () {
                        vm.Members.remove(member);
                    });
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
            var _this = this;
            $.getJSON("/home/memberlist").then(function (rawData) {
                return ko.utils.arrayMap(rawData, function (instanceData) {
                    return new _this.MemberViewModel(instanceData);
                });
            }).done(function (mappedData) {
                _this.ApplyBindings(mappedData);
            });
        };

        Site.prototype.ApplyBindings = function (data) {
            console.log("Applybindings");
            var self = this;
            ko.applyBindings(new self.MasterViewModel(data, self));
        };

        Site.prototype.LoadNextWinner = function (model) {
            $('#display2').val("            ").change();

            $.getJSON("/home/nextwinner").then(function (rawData) {
                if (rawData.MemberId == 0) {
                    $('#display1').val("SWAGOLICIOUS").change();
                    $('#display2').val(" SMART DEVS ").change();
                    $('#myModal').modal();
                } else {
                    var nextWinner = ko.utils.arrayFirst(model.Members, function (item) {
                        return item.Id === rawData.Winner.MemberId;
                    });

                    model.WinnerShown(true);
                    model.Winner(rawData.Winner.Name);
                    model.WinnerSwagThing(rawData.WonSwag.Thing);
                    model.WinnerPhoto(rawData.Winner.Photo);

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
        return Site;
    })();
    Swagolicious.Site = Site;
})(Swagolicious || (Swagolicious = {}));

$(function () {
    var site = new Swagolicious.Site();
});
//# sourceMappingURL=site.js.map
