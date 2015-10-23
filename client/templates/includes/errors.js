Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});
//3000毫秒删除之前的一个错误
Template.error.onRendered = function(){
  var error = this.data;
  Meteor.setTimeout(function () {
    Errors.remove(error._id);
  }, 3000);
}
