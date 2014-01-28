module Swagolicious {

    export class Swag {

        constructor() {
            this.WireUp();
        }


        private WireUp() {
            ko.applyBindings(this.viewModel);
            $("form").validate({ submitHandler: this.viewModel.save });
        }

        private SwagModel = function (swag) {
            this.swagList = ko.observableArray(swag);

            this.addSwag = () => {
                this.swagList.push({
                    name: "",
                    quantity: 1
                });
            };

            this.removeSwag = data=> {
                this.swagList.remove(data);
            };

            this.save = form=> {
                ko.utils.postJson(location.href, { swag: this.swagList }, null);
                //alert("Could now transmit to server: "); //+ ko.utils.stringifyJson(this.gifts));
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
