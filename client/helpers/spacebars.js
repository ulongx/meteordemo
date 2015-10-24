UI.registerHelper('pluralize', function(n, thing) {
  // 处理单复数形式
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});
