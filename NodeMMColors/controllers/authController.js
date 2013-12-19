var mvc = require('../../mvc');
var _ = require('lodash');
var passport = require('passport');

function authController() {
    
}


authController.prototype = _.create(mvc.BaseController.prototype, {
   index: function() {
       return this.view();
   },
   
   google:function() {
       this.middleware(
       passport.authenticate('google', {
           scope: [
               'https://www.googleapis.com/auth/userinfo.profile',
               'https://www.googleapis.com/auth/userinfo.email'
           ]
       }))
       ;
   },
   
   googlecallback:function() {
       var that = this;
       this.middleware(passport.authenticate('google', { failureRedirect: '/auth' }), function() {
           that.view('index').execute();
       });


   }
});


module.exports = authController;