import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginStyledComponents } from '@rsbuild/plugin-styled-components';

export default defineConfig({
  plugins: [pluginReact(), pluginSass(), pluginStyledComponents()],
  output: {
    cssModules: {
      localIdentName:
        process.env.NODE_ENV === 'production'
          ? '[local]-[hash:base64:6]'
          : '[name]__[local]-[hash:base64:6]',
      auto: (resource) => {
        return resource.includes('.module.') || resource.includes('shared/');
      },
    },
  },
  server: {
    compress: false,
    proxy: {
      '/sse': {
        target: 'http://127.0.0.1:3001', // 将会代理到 ws://localhost:3001/sse
        changeOrigin: true,
        ws: true,
      },
      '/file': {
        target: 'http://127.0.0.1:3001',
      },
    },
  },
});
