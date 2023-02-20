import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ['oasis-engine'] },
  optimizeDeps: {
    exclude: [
      'oasis-engine',
      '@antv/x6',
      '@oasis-engine/stats',
      '@oasis-engine/core',
      '@oasis-engine/math',
      '@oasis-engine/loader',
      '@oasis-engine/draco',
      '@oasis-engine/editor-gizmo',
      '@oasis-engine/controls',
      '@oasis-engine/touch',
      '@oasis-engine/lottie',
      '@oasis-engine/spine',
      '@oasis-engine/physics-physx',
      '@oasis-engine/baker',
      'oasis-engine-toolkit',
      '@oasis-engine-toolkit/auxiliary-lines',
      '@oasis-engine-toolkit/gizmo',
      '@oasis-engine-toolkit/controls',
      '@oasis-engine-toolkit/framebuffer-picker',
      '@oasis-engine-toolkit/outline',
      '@oasis-engine-toolkit/lines',
      '@oasis-engine-toolkit/stats',
      '@oasis-engine-toolkit/skeleton-viewer',
      '@oasis-engine/react-dnd',
    ],
  },
  build: {
    outDir: './docs',
  },
});
