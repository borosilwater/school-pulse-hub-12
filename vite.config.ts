import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync, existsSync } from "fs";

// Plugin to copy HTML files to dist
const copyHtmlFiles = () => {
  return {
    name: 'copy-html-files',
    writeBundle() {
      const htmlFiles = [
        'about.html',
        'campus-life.html', 
        'news-events.html',
        'admissions.html',
        'achievements.html',
        'contact.html',
        'gallery.html'
      ];
      
      htmlFiles.forEach(file => {
        if (existsSync(file)) {
          copyFileSync(file, `dist/${file}`);
        }
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    copyHtmlFiles()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
