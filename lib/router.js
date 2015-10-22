//路由控制类，定义了首页的layout布局
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('posts'); }//系统route提供数据等待方法，等订阅完
});
//访问首页，映射对应的模版
Router.route("/", {
  name:"postsList",
});
//通过参数方式，访问一个模版
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});
