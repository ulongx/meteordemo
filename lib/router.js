//路由控制类，定义了首页的layout布局
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('posts'); }//系统router提供数据等待方法，等订阅完成
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

/*新帖提交*/
Router.route('/submit', {name: 'postSubmit'});


/*
告诉 Iron Router 不仅在非法路由情况下，而且在 postPage 路由，
每当 data 函数返回“falsy”（比如 null、false、undefined 或 空）对象时，显示“无法找到”的页面。
*/
Router.onBeforeAction('dataNotFound', {only: 'postPage'});


/*
为什么叫 “Iron”?
你也许会想知道命名“Iron Router”背后的故事。根据 Iron Router 的作者 Chris Mather，因为流星（meteor）主要由铁（iron）元素构成的事实。
hahahahahahaha
*/
