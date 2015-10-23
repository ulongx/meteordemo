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
    //验证服务器返回数据的代码段
    // if (Meteor.isServer) {
    //   postAttributes.title += "(server)";
    //   // wait for 5 seconds
    //   Meteor._sleepForMs(5000);
    // } else {
    //   postAttributes.title += "(client)";
    // }
    /*服务器端验证，以免有人绕过前端页面的验证，从控制台提交数据*/
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和 URL");

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

/*错误验证，查看文本框是否不为空*/
validatePost = function (post) {
  var errors = {};
  if (!post.title)
    errors.title = "请填写标题";
  if (!post.url)
    errors.url =  "请填写 URL";
  return errors;
}


//是否有权限修改删除
Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});
//限制用户只能修改，限定的字段
// fieldNames 数组，它包含了需要被修改的字段，并使用 Underscore 的 without() 方法返回一个不包含 url 和 title 字段的子数组。
//正常情况下，这个数组应该是空的，它的长度应该是0。如果有人采取其他操作，这个数组的长度将变为1或更多，回调函数将返回 true （因此禁止更新）。
Posts.deny({
  update: function(userId, post, fieldNames) {
    // 只能更改如下两个字段：
    return (_.without(fieldNames, 'url', 'title').length > 0);
  },
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});
