/*
Helper 参数
模板的 helper 标签可以带参数。
你可以给你的函数传递命名的参数，你也可以传入不指定数量的匿名参数并在函数中用 arguments 对象访问他们。
在最后一种情况，你可能想将 arguments 对象转换成一个一般的 JavaScript 数组，然后调用 pop() 方法移除末尾的内容。
对于每一个导航链接， activeRouteClass helper 可以带一组路由名称，
然后使用 Underscore 的 any() helper 方法检查哪一个通过测试 (例如: 他们的 URL 等于当前路径)。
如果路由匹配当前路径，any() 方法将返回 true。最后，我们利用 JavaScript 的 boolean && string 模式，
当 false && myString 返回 false, 当 true && myString 返回 myString。
*/
Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
  }
});
