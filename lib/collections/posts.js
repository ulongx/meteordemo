Posts = new Mongo.Collection('posts');
// Posts.allow 是告诉 Meteor：这是一些允许客户端去修改帖子集合的条件。上面的代码，等于说“只要客户拥有 userId 就允许去插入帖子”。
// Posts.allow({
//   insert: function(userId, doc) {
//     // 只允许登录用户添加帖子
//     return !! userId;
//   }
// });
/*
再见 Allow/Deny
因为 Meteor Methods 是在服务器上执行，所以 Meteor 假设它们是可信任的。这样的话，Meteor 方法就会绕过任何 allow/deny 回调。
*/

Meteor.methods({

  postInsert: function(postAttributes) {
    /* check 检查参数的数据类型 */
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String
    });

    /*
    我们在数据库中搜寻是否存在相同的 URL。如果找到，我们 return 返回那帖子的 _id 和 postExists: true 来让用户知道这个特别的情况。
    */
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    /* 注意的是 _.extend() 方法来自于 Underscore 库，作用是将一个对象的属性传递给另一个对象。*/
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  }
});
