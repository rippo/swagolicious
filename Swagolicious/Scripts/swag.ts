module Swagolicious {

    export class Swag {

        constructor() {
            this.WireUp();
        }


        private WireUp() {
            var instance = new this.ViewModel();
            ko.applyBindings(instance);

            //Idea came from http://notebookheavy.com/2012/09/05/knockout-view-models-jquery-deferreds/
            //  JQuery calls the get method on the view model and waits with a promise
            //    and then binds the data to the swag list. NEAT
            $.when(instance.get()).then(data=> {
                instance.swagList(ko.utils.arrayMap(data, item=> {
                    $("form").validate({ submitHandler: instance.save });
                    return new this.SwagModel(item);
                }));
            });

        }


        private SwagModel = function (data) {
            this.Name = data.Name;
            this.Quantity = data.Quantity;
        };

        private ViewModel = function () {
            this.swagList = ko.observableArray();

            this.get = () => $.getJSON("/swag/allswag");

            this.addSwag = () => { this.swagList.push({ Name: "", Quantity: 1 }); };

            this.removeSwag = data=> { this.swagList.remove(data); };

            this.save = () => { ko.utils.postJson("/swag/index", { swag: this.swagList }, null); };

        };

    }

}

$(() => {
    var swag = new Swagolicious.Swag();
});
