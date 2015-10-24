/*只发布给客户端，posts这个数据库，然后客户端可以通过订阅来获得数据，系统中默认是用：autopublish 包完成的*/
Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});
Meteor.publish('singlePost', function(id) {
  check(id, String)
  return Posts.find(id);
});
//发布的评论，根据传过来的参数，获得评论
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
