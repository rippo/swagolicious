var Swagolicious;
(function (Swagolicious) {
    var Test = (function () {
        function Test() {
            this.ViewModel = function () {
                var _this = this;
                var vm = this;
                vm.clickMe = function () {
                    _this.LoadNextWinner(vm);
                };
            };
            this.WireUp();
        }
        Test.prototype.WireUp = function () {
            var instance = new this.ViewModel();
            ko.applyBindings(instance);
        };

        Test.prototype.LoadNextWinner = function (vm) {
            console.log("clicked");
            console.log(vm);
        };
        return Test;
    })();
    Swagolicious.Test = Test;
})(Swagolicious || (Swagolicious = {}));

$(function () {
    var test = new Swagolicious.Test();
});
//# sourceMappingURL=test.js.map
