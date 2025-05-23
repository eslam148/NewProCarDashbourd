import { defineConfig } from 'vite';
import { Plugin } from 'vite';

function leafletImagePlugin(): Plugin {
  return {
    name: 'leaflet-image-plugin',
    transform(code, id) {
      if (id.includes('leaflet.css')) {
        return {
          code: code.replace(/url\(images\//g, 'url(/assets/'),
          map: null
        };
      }
    }
  };
}

export default defineConfig({
  plugins: [leafletImagePlugin()],
  assetsInclude: ['**/*.png'],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
