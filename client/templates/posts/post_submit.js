
//错误验证，每次进入这个模版的时候，创建一个新的session对象，使之前的错误不再出现
Template.postSubmit.onCreated = function(){
   Session.set('postSubmitErrors', {});
};
Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});
/*最好使用 submit 事件（而不是按钮的 click 事件），因为这会覆盖所有可能的提交方式（比如敲击回车键）。
我们需要调用 event 的 preventDefault 方法来确保浏览器不会再继续尝试提交表单。*/
Template.postSubmit.events({

  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };
    /*错误验证，查看文本框是否不为空，return终止helper的继续执行*/
    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);


    // post._id = Posts.insert(post);
    // Router.go('postPage', post);
    /*Collection 的 insert、update 和 remove 都属于 Meteor 内置方法,使用内置方法插入数据
    postInsert:在公用lib posts里面定义的插入方法
    */
    Meteor.call("postInsert", post, function(error, result){
      if(error){
        Errors.throw(error);
      }
      // 显示结果，跳转页面
      if (result.postExists)
        Errors.throw('该链接记录已经存在');

      if(result){
         Router.go('postPage', {_id: result._id});
      }
    });
    //Router.go('postsList');
  }
});
