
//错误验证，每次进入这个模版的时候，创建一个新的session对象，使之前的错误不再出现
Template.postEdit.onCreated = function(){
   Session.set('postSubmitErrors', {});
};
Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    var errors = validatePost(postProperties);
    if (errors.title || errors.url)
     return Session.set('postEditErrors', errors);

    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // 向用户显示错误信息
        throwError(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("你确定要删除么?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});
