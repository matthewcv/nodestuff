
var ar = require('./ActionResults');
var _ = require('lodash');

function BaseController() {

}

BaseController.prototype = {


    /*
    an object that looks like this:
    {
        route: route,  //string - the full route registered for the request      
        controller: controller,  //string - the name of the controller to handle the request
        action:action,  //string - the name of the action
        actionArgs:actionArgs, //array - the names of the action method's arguments
        req: //expressjs request
        res: //expressjs response
    }

    */
    requestContext: null,


    executeAction: function () {

        var that = this;
        var req = this.requestContext.req;
        var actionArgValues = [];
        this.requestContext.actionArgs.forEach(function (argName) {
            if (argName == "$body") {
                actionArgValues.push(req.body);
            } else if (argName == "$query") {
                actionArgValues.push(req.query);
            } else {
                actionArgValues.push(req.params[argName]);
            }
        });

        var result = this[this.requestContext.action].apply(this, actionArgValues);

        if (result && result.execute) {
            result.execute();
        }
    },

    /*
        calls the function (mw) as a connect middleware with the callback (cb)
    */
    middleware:function(mw, cb) {
        mw(this.requestContext.req, this.requestContext.res, cb);
    },
    
    view:function(viewName, model) {
        return getActionResult(ar.RenderViewTemplateActionResult,this,{model:model,viewName:viewName});
    },
    
    json:function(model) {
        return getActionResult(ar.JsonActionResult,this,{model:model});
    }


};


function getActionResult(arConst,controller, props) {
    var ar = Object.create(arConst.prototype);
    ar.requestContext = controller.requestContext;
    _.assign(ar, props);

    return ar;
}


exports.BaseController = BaseController;
