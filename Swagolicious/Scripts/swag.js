var Swagolicious;
(function (Swagolicious) {
    var Swag = (function () {
        function Swag() {
            this.SwagViewModel = function (data) {
                var _this = this;
                this.swagList = ko.observableArray(data);

                this.addSwag = function () {
                    _this.swagList.push({
                        Name: "",
                        Quantity: 1
                    });
                };

                this.removeSwag = function (data) {
                    _this.swagList.remove(data);
                };

                this.save = function () {
                    ko.utils.postJson("/swag/index", { swag: _this.swagList }, null);
                    //alert("Could now transmit to server: "); //+ ko.utils.stringifyJson(this.gifts));
                    // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
                };
            };
            this.SwagModel = function (data) {
                var self = this;
                self.Name = data.Name;
                self.Quantity = data.Quantity;
            };
            this.WireUp();
        }
        Swag.prototype.WireUp = function () {
            var _this = this;
            $.getJSON("/swag/allswag").then(function (rawData) {
                return ko.utils.arrayMap(rawData, function (instanceData) {
                    return new _this.SwagModel(instanceData);
                });
            }).done(function (mappedData) {
                _this.ApplyBindings(mappedData);
            });
            //ko.applyBindings(this.viewModel);
        };

        Swag.prototype.ApplyBindings = function (data) {
            console.log("Applybindings");
            var foo = new this.SwagViewModel(data);
            ko.applyBindings(foo);
            $("form").validate({ submitHandler: foo.save });
        };
        return Swag;
    })();
    Swagolicious.Swag = Swag;
})(Swagolicious || (Swagolicious = {}));

$(function () {
    var swag = new Swagolicious.Swag();
});
//# sourceMappingURL=swag.js.map
