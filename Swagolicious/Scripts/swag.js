var Swagolicious;
(function (Swagolicious) {
    var Swag = (function () {
        function Swag() {
            this.SwagModel = function (data) {
                this.Name = data.Name;
                this.Quantity = data.Quantity;
            };
            this.ViewModel = function () {
                var _this = this;
                this.swagList = ko.observableArray();

                this.get = function () {
                    return $.getJSON("/swag/allswag");
                };

                this.addSwag = function () {
                    _this.swagList.push({ Name: "", Quantity: 1 });
                };

                this.removeSwag = function (data) {
                    _this.swagList.remove(data);
                };

                this.save = function () {
                    ko.utils.postJson("/swag/index", { swag: _this.swagList }, null);
                };
            };
            this.WireUp();
        }
        Swag.prototype.WireUp = function () {
            var _this = this;
            var instance = new this.ViewModel();
            ko.applyBindings(instance);

            //Idea came from http://notebookheavy.com/2012/09/05/knockout-view-models-jquery-deferreds/
            //  JQuery calls the get method on the view model and waits with a promise
            //    and then binds the data to the swag list. NEAT
            $.when(instance.get()).then(function (data) {
                instance.swagList(ko.utils.arrayMap(data, function (item) {
                    $("form").validate({ submitHandler: instance.save });
                    return new _this.SwagModel(item);
                }));
            });
        };
        return Swag;
    })();
    Swagolicious.Swag = Swag;
})(Swagolicious || (Swagolicious = {}));

$(function () {
    var swag = new Swagolicious.Swag();
});
//# sourceMappingURL=swag.js.map
