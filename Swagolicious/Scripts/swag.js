var Swagolicious;
(function (Swagolicious) {
    var Swag = (function () {
        function Swag() {
            this.SwagModel = function (swag) {
                var _this = this;
                this.swagList = ko.observableArray(swag);

                this.addSwag = function () {
                    _this.swagList.push({
                        name: "",
                        quantity: 1
                    });
                };

                this.removeSwag = function (data) {
                    _this.swagList.remove(data);
                };

                this.save = function (form) {
                    ko.utils.postJson(location.href, { swag: _this.swagList }, null);
                    //alert("Could now transmit to server: "); //+ ko.utils.stringifyJson(this.gifts));
                    // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
                };
            };
            this.viewModel = new this.SwagModel([
                { name: "Tall Hat", quantity: 1 },
                { name: "Long Cloak", quantity: 2 }
            ]);
            this.WireUp();
        }
        Swag.prototype.WireUp = function () {
            ko.applyBindings(this.viewModel);
            $("form").validate({ submitHandler: this.viewModel.save });
        };
        return Swag;
    })();
    Swagolicious.Swag = Swag;
})(Swagolicious || (Swagolicious = {}));

$(function () {
    var swag = new Swagolicious.Swag();
});
//# sourceMappingURL=swag.js.map
