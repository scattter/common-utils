import { createFilter } from '@rollup/pluginutils';

const RemoveStyle = () => {
  const options = {
    include: ['src/**/*'],
    exclude: [/node_modules/],
  };
  const filter = createFilter(options.include, options.exclude);
  const isSSR = process.argv.includes('--ssr')

  return {
    name: 'RemoveStyle',
    transform(code, id) {
      // 如果不是ssr模式或者不是src目录下的文件，直接返回
      if (!filter(id) || !isSSR) return

      // 删除index.css和index.scss的引入
      const reg = /import\s+["']\.(\/)?index\.(css|scss)["'];/g
      if (reg.test(code)) {
        const source = code.replace(reg, '')
        return {
          code: source,
          // 返回一个空的 sourcemap (这里是移除代码, 不用转换)
          // 如果不想转换代码，则可以通过返回 null 来保留现有的 sourcemap
          map: { mappings: '' }
        }
      }
    },
  }
}

export default RemoveStyle