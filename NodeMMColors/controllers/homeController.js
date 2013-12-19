var mvc = require('../../mvc');
var util = require('util');
var _ = require('lodash');

//define the controller.  
function HomeController() {
    
}





//use BaseController prototype
util.inherits(HomeController, mvc.BaseController);

//define actions.  
_.assign(HomeController.prototype, {
    Index: function() {
        return this.view();
    },
    
    Something:function(id,poo, $body) {
        /*
        the parameters id and poo are turned into route variables.  In this case the round would look like /Home/Something/:id/:poo and anything in the URL at those positions
        will be sent to these parameters when the action method is invoked.

        Here, $body is a special parameter type.  If present then the body of the request will be a parsed and passed in to this parameter.
        */
        return this.view("something", { id: id, poo: poo });
    },
    
    GetJson:function($query) {
        /*
        Here, $query is a special parameter type.  If present then the query portion of the request will be a parsed and passed in to this parameter.
        */
        return this.json({ now: new Date(), age:38, name:'Matthew', badAss:true });
        
    }
});


//action configurations
HomeController.prototype.Something.METHOD = 'post'; //a string or an array of strings.  If this is blank, assumes "get"





//export the controller
module.exports = HomeController;
