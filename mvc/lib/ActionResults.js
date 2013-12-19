var util = require('util');
var _ = require('lodash');
var path = require('path');

function BaseActionResult() {
    
}

BaseActionResult.prototype = {    
    requestContext: null,

};



function RenderViewTemplateActionResult() {
    
}

util.inherits(RenderViewTemplateActionResult, BaseActionResult);

_.assign(RenderViewTemplateActionResult.prototype, {
    
    viewName:null,
    model:null,
    execute:function() {

        var view = ['', this.requestContext.controller, this.viewName || this.requestContext.action].join(path.sep);

        this.requestContext.res.render(view, { model: this.model });

    }
    
});


function JsonActionResult() {
    
}

util.inherits(JsonActionResult, BaseActionResult);

    _.assign(JsonActionResult.prototype, {
        model:null,

    execute: function() {
        this.requestContext.res.json(this.model);
    }
});

exports.BaseActionResult = BaseActionResult;
exports.RenderViewTemplateActionResult = RenderViewTemplateActionResult;
exports.JsonActionResult = JsonActionResult;