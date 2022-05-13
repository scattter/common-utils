import Vue from '../source/vue.js'

const state = Vue.observable({ visible: true, content: '' })
let tooltip = null

Vue.directive('tool', {
  // 指令初始化
  bind(el, binding) {
    // 初始化tooltip组件
    if (!tooltip) {
      // 使用extend创建vue组件, 平时用的更多的是vue.component
      const Instance = Vue.extend({
        render(h) {
          h('el-tooltip', {
            ref: 'tooltip',
            props: {
              effect: 'light',
              placement: 'top',
              value: state.visible,
              content: state.content
            }
          })
        }
      })
      tooltip = new Instance().$mount()
      document.body.appendChild(tooltip)
    }
    
    el.addEventListener('mouseenter', function(e) {
      if (el.scrollWidth > el.offsetWidth) {
        const tip = tooltip.$refs.tooltip;
        // 每次建新的tooltip的时候销毁前一个, 防止速度过快出现闪烁
        tip.$refs.popper && (tip.$refs.popper.style.display = 'none');
        tip.doDestroy();
        tip.setExpectedState(true);
        // tooltip每次渲染的时候都需要有一个基本元素, 这里是为其赋值
        tip.referenceElm = e.srcElement;
        // 更新全局状态state
        state.visible = true;
        state.content = binding.value;
      }
    })
    
    el.addEventListener('mouseleave', function(e) {
      tooltip.$refs.tooltip.referenceElm = e.srcElement;
      state.visible = false;
    })
  }
})
