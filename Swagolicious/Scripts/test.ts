 module Swagolicious {

     export class Test {

         constructor() {
             this.WireUp();
         }

         private WireUp() {
             var instance = new this.ViewModel();
             ko.applyBindings(instance);
         }

        private ViewModel = function() {
            var vm = this;
            vm.clickMe = () => {
                this.LoadNextWinner(vm);
            };
         }

         private LoadNextWinner(vm) {
             console.log("clicked");
             console.log(vm);
         }
     }
 }


 $(() => {
     var test = new Swagolicious.Test();
 });
