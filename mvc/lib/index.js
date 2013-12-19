
var fs = require('fs');
var path = require('path');
var util = require('./util');
var _ = require('lodash');
var bc = require('./BaseController');
var ar = require('./ActionResults');

function mvc(app, ready) {
    mvc.app = app;


    getControllers(function() {
        applyRoutes(ready);
    });
}

function applyRoutes(done) {
    //var args = util.getFunctionArgs(controllers[0].controller.prototype.Index);


    mvc.controllers.forEach(function(controller) {
        for (name in controller.prototype) {
            if (controller.prototype.hasOwnProperty(name) &&  typeof(controller.prototype[name]) == "function") {
                addRoute(controller, name);
            }
        }
    });


    done();
}


function addRoute(controller, action) {
    var actionFunc = controller.prototype[action];
    var args = util.getFunctionArgs(actionFunc);
    var cName = controller.name.substring(0, controller.name.length - 10);
    var routeParts = ['',cName,action];

    args.forEach(function(arg) {
        if (arg != "$body" && arg != "$query") {
            routeParts.push(":" + arg);
        }
    });

    var routeHandler = function(req, res) {
        var c = Object.create(controller.prototype);
        c.requestContext = {
            route: route,
            controller: cName,
            action: action,
            actionArgs: args,
            req: req,
            res: res,
        };
        c.executeAction();
    };

    var route = routeParts.join('/');
    var verbs = getVerbsFromAction(actionFunc, mvc.app);
    verbs.forEach(function(verb) {
        mvc.app[verb](route, routeHandler);
    });
    
    if (action.toLowerCase() == 'index') {
        mvc.app.get('/' + cName, routeHandler);
        
        if (cName.toLowerCase() == 'home') {
            mvc.app.get('/', routeHandler);
        }
    }

}

function getControllers(done) {
    var appDir = path.dirname(require.main.filename);
    var dir = path.join(appDir, 'controllers');

    fs.readdir(dir, function(err, files) {
        mvc.controllers = files.filter(function(file) {
            return file.toLowerCase().endsWith('controller.js');
            
        }).map(function(file) {
            return require(path.join(dir,file));
        });



        done();
    });
}



function getVerbsFromAction(actionFunc, app) {
    var verb = actionFunc.METHOD;
    
    if (_.isUndefined(verb)) {
        return ['get'];
    }

    if (!_.isArray(verb)) {
        verb = [verb];
    }

    return verb.map(function(v) { return v.toLowerCase(); }).filter(function (v) { return !!app[v]; });
}



_.assign(mvc, bc);
_.assign(mvc, ar);
module.exports = mvc;

