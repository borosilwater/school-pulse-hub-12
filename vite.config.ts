import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync, existsSync, mkdirSync } from "fs";

// Plugin to copy HTML files and CSS files to dist
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
        'gallery.html',
        'news.html',
        'login.html',
        'teacher-dashboard.html',
        'student-dashboard.html'
      ];
      
  const cssFiles = [
    'style.css',
    'responsive.css',
    'navbar.css',
    'navbar-new.css'
  ];
      
      const jsFiles = [
        'main.js',
        'achievements.js',
        'admissions.js',
        'contact.js',
        'news-events.js'
      ];
      
      const redirectFiles = [
        'public/_redirects',
        'public/redirect.js'
      ];
      
      // Copy HTML files
      htmlFiles.forEach(file => {
        if (existsSync(file)) {
          copyFileSync(file, `dist/${file}`);
          console.log(`Copied ${file} to dist/`);
        }
      });
      
      // Copy CSS files
      cssFiles.forEach(file => {
        if (existsSync(file)) {
          copyFileSync(file, `dist/${file}`);
          console.log(`Copied ${file} to dist/`);
        }
      });
      
      // Copy JS files
      jsFiles.forEach(file => {
        if (existsSync(file)) {
          copyFileSync(file, `dist/${file}`);
          console.log(`Copied ${file} to dist/`);
        }
      });
      
      // Copy redirect files
      redirectFiles.forEach(file => {
        if (existsSync(file)) {
          const fileName = file.split('/').pop();
          copyFileSync(file, `dist/${fileName}`);
          console.log(`Copied ${file} to dist/${fileName}`);
        }
      });
      
      // Ensure images directory exists in dist
      try {
        mkdirSync('dist/images', { recursive: true });
        console.log('Created dist/images directory');
      } catch (error) {
        // Directory might already exist, that's fine
      }
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
