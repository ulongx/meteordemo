/*最好使用 submit 事件（而不是按钮的 click 事件），因为这会覆盖所有可能的提交方式（比如敲击回车键）。
我们需要调用 event 的 preventDefault 方法来确保浏览器不会再继续尝试提交表单。*/
Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    post._id = Posts.insert(post);
    Router.go('postPage', post);
  }
});
