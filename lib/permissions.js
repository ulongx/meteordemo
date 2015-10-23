//权限设置文件
// 检查是不是属于自己的帖子
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}
