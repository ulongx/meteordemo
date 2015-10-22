/*只发布给客户端，posts这个数据库，然后客户端可以通过订阅来获得数据，系统中默认是用：autopublish 包完成的*/
Meteor.publish('posts', function(author) {
  return Posts.find();
});
