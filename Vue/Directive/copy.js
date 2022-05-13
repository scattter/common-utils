const myCopy = {
  bind(el, { value }) {
    // 使用el全局保存copy的值
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        alert('not have content')
        return
      }
      const textarea = document.createElement('textarea');
      // 防止ios下调用键盘
      textarea.readOnly = true;
      // 隐藏元素
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      // 添加值
      textarea.value = el.$value;
      // 选中当前的值
      textarea.select();
      // 执行copy 并且判断是否成功复制
      const result = document.execCommand('Copy')
      if (result) {
        alert('success copy')
      }
      document.removeChild(textarea);
    }
    el.addEventListener('click', el.handler)
  },
  // 更新绑定的value
  componentUpdated(el, { value }) {
    el.$value = value;
  },
  unbind(el) {
    document.removeEventListener('click', el.handler)
  }
}

export default myCopy
