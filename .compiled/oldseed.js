// Generated by LiveScript 1.6.0
(function(){
  var localStorage;
  localStorage = require('localStorage');
  module.exports = function(){
    var val, ref$;
    val = (ref$ = localStorage.getItem('seed')) != null ? ref$ : "";
    localStorage.setItem('seed', "");
    return val;
  };
}).call(this);
