//路由控制类，定义了首页的layout布局
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('notifications'); }//系统router提供数据等待方法，等订阅完成
});

//创建路由控制器
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,//默认显示5条
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});

//访问首页，映射对应的模版
//参数后面的 ? 表示参数是可选的。这样路由就能同时匹配 http://localhost:3000/50 和 http://localhost:3000。
Router.route("/:postsLimit?", {
  name:"postsList"
});
//通过参数方式查询数据，访问一个模版
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {//路劲级别的订阅，每当打开路径时加载数据，而不是初始化应用时加载它
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

/*新帖提交*/
Router.route('/submit', {name: 'postSubmit'});
/*编辑帖子*/
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

/*检查用户是否登录，如果他们没有登录，呈现出来的是 accessDenied 模板而不是 postSubmit 模板。*/
var requireLogin = function() {
  if (! Meteor.user()) {
    /*客户端在登录过程中，有延迟情况，加上一个延迟loading，会比较好*/
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

/*
告诉 Iron Router 不仅在非法路由情况下，而且在 postPage 路由，
每当 data 函数返回“falsy”（比如 null、false、undefined 或 空）对象时，显示“无法找到”的页面。
*/
Router.onBeforeAction('dataNotFound', {only: 'postPage'});

/*通过才去新帖子模版*/
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

/*
为什么叫 “Iron”?
你也许会想知道命名“Iron Router”背后的故事。根据 Iron Router 的作者 Chris Mather，因为流星（meteor）主要由铁（iron）元素构成的事实。
hahahahahahaha
*/
