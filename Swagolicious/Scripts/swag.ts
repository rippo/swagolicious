module Swagolicious {

    export class Swag {

        constructor() {
            this.WireUp();
        }


        private WireUp() {
            $.getJSON("/swag/allswag")
                .then(rawData=> ko.utils.arrayMap(rawData,
                    instanceData=> new this.SwagViewModel(instanceData)))
                .done(mappedData=> {
                    this.ApplyBindings(mappedData);
                });

            //ko.applyBindings(this.viewModel);
        }

        private ApplyBindings(data) {
            console.log("Applybindings");
            var foo = new this.SwagModel(data);
            ko.applyBindings(foo);
            $("form").validate({ submitHandler: foo.save });
        }


        private SwagModel = function (data) {
            this.swagList = ko.observableArray(data);

            this.addSwag = () => {
                this.swagList.push({
                    Name: "",
                    Quantity: 1
                });
            };

            this.removeSwag = data=> {
                this.swagList.remove(data);
            };

            this.save = () => {
                ko.utils.postJson("/swag/index", { swag: this.swagList }, null);
                //alert("Could now transmit to server: "); //+ ko.utils.stringifyJson(this.gifts));
                // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
            };
        };


        private SwagViewModel = function (data) {
            var self = this;
            self.Name = data.Name;
            self.Quantity = data.Quantity;
        };

    }

}

$(() => {
    var swag = new Swagolicious.Swag();
});
