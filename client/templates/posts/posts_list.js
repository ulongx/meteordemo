//填充模版的数据
// Template.postsList.helpers({
//   posts: function() {
//     return Posts.find({}, {sort: {submitted: -1}});
//   }
// });
/**
moveElement hook 接受两个参数：node 和 next。
node 是当前正在移动到新位置的 DOM 元素
next 是 node 移动的新位置之后的元素

jQuery 方法：
$()：使任何一个 DOM 元素成为 jQuery 对象。
offset()：取得元素相对于文档的当前位置，返回包含 top 和 left 属性的对象。
outerHeight()：取得“outer”元素的高度（包括 padding 和可选的 margin）。
nextUntil(selector)：取得所有目标元素之后到（但不包含）匹配 selector 的元素。
insertBefore(selector)：在匹配 selector 的元素之前插入另一个元素。
removeClass(class)：如果该元素有 class CSS 类，删除它。
css(propertyName, propertyValue)：设置 CSS propertyName 属性为 propertyValue。
height()：取得该元素的高度。
addClass(class)：为元素添加 class CSS 类。
*/
Template.postsList.onRendered = function(){
  this.find('.wrapper')._uihooks = {
    insertElement: function (node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    moveElement: function (node, next) {
      var $node = $(node), $next = $(next);
      var oldTop = $node.offset().top;
      var height = $node.outerHeight(true);

      // 找出 next 与 node 之间所有的元素
      var $inBetween = $next.nextUntil(node);
      if ($inBetween.length === 0)
        $inBetween = $node.nextUntil(next);

      // 把 node 放在预订位置
      $node.insertBefore(next);

      // 测量新 top 偏移坐标
      var newTop = $node.offset().top;

      // 将 node *移回*至原始所在位置
      $node
        .removeClass('animate')
        .css('top', oldTop - newTop);

      // push every other element down (or up) to put them back
      $inBetween
        .removeClass('animate')
        .css('top', oldTop < newTop ? height : -1 * height);

      // 强制重绘
      $node.offset();

      // 动画，重置所有元素的 top 坐标为 0
      $node.addClass('animate').css('top', 0);
      $inBetween.addClass('animate').css('top', 0);
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  }

}
