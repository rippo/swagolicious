var Swagolicious;
(function (Swagolicious) {
    var Swag = (function () {
        function Swag() {
            this.SwagModel = function (swag) {
                var _this = this;
                var self = this;
                self.swagList = ko.observableArray(swag);

                self.addSwag = function () {
                    _this.swagList.push({
                        name: "",
                        quantity: 1
                    });
                };

                self.removeSwag = function (data) {
                    _this.swagList.remove(data);
                };

                self.save = function (form) {
                    alert("Could now transmit to server: ");
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
        };
        return Swag;
    })();
    Swagolicious.Swag = Swag;
})(Swagolicious || (Swagolicious = {}));

$(function () {
    var swag = new Swagolicious.Swag();
});
//# sourceMappingURL=swag.js.map
