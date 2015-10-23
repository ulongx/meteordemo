//将它的 MongoDB 集合命名为 null （因为集合的数据将不会保存在服务器端的数据库中）
// 本地（仅客户端）集合
Errors = new Mongo.Collection(null);

/*
使用本地集合去存储错误的优势在于，就像所有集合一样，
它是响应性的————意味着我们可以以显示其他任何集合数据的同样的方式，去响应性地显示错误。
*/
throwError = function(message) {
  Errors.insert({message: message});
};
