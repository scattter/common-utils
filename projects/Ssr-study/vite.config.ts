import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import RemoveStyle from './plugins/rollup-plugin-remove-style'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), RemoveStyle()],
})
