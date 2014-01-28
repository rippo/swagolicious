module Swagolicious {

    export class Swag {

        constructor() {
            this.WireUp();
        }


        private WireUp() {
            ko.applyBindings(this.viewModel);
        }

        private SwagModel = function (swag) {
            var self = this;
            self.swagList = ko.observableArray(swag);

            self.addSwag = () => {
                this.swagList.push({
                    name: "",
                    quantity: 1
                });
            };

            self.removeSwag = data=> {
                this.swagList.remove(data);
            };

            self.save = form=> {
                alert("Could now transmit to server: "); //+ ko.utils.stringifyJson(this.gifts));
                // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
            };
        };

        private viewModel = new this.SwagModel([
            { name: "Tall Hat", quantity: 1 },
            { name: "Long Cloak", quantity: 2 }
        ]);

    }

}

$(() => {
    var swag = new Swagolicious.Swag();
});
