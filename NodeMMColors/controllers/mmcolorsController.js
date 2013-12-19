var mvc = require('../../mvc');
var _ = require('lodash');


function mmcolorsController() {
    
}


mmcolorsController.prototype = _.create(mvc.BaseController.prototype, {
   index: function() {
       return this.view();
   } 
});


module.exports = mmcolorsController;