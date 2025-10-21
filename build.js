const fs = require('fs');
const path = require('path');

// Minify CSS function (simple implementation)
function minifyCSS(css) {
    return css
        .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}|:;,])\s*/g, '$1') // Remove whitespace around symbols
        .replace(/;}/g, '}') // Remove trailing semicolons
        .trim();
}

// Minify JS function (simple implementation)
function minifyJS(js) {
    return js
        .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\//g, '') // Remove multi-line comments
        .replace(/\/\/[^\n]*\n/g, '\n') // Remove single-line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}|:;,()=\[\]])\s*/g, '$1') // Remove whitespace around symbols
        .trim();
}

// Process files
function build() {
    console.log('Starting build process...');
    
    // Minify CSS
    try {
        const cssFiles = ['styles.css', 'themes.css'];
        cssFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const cssContent = fs.readFileSync(file, 'utf8');
                const minifiedCSS = minifyCSS(cssContent);
                fs.writeFileSync(`dist/${file}`, minifiedCSS);
                console.log(`Minified ${file}`);
            }
        });
    } catch (err) {
        console.error('Error minifying CSS:', err);
    }
    
    // Minify JS
    try {
        const jsFiles = ['main.js'];
        jsFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const jsContent = fs.readFileSync(file, 'utf8');
                const minifiedJS = minifyJS(jsContent);
                fs.writeFileSync(`dist/${file}`, minifiedJS);
                console.log(`Minified ${file}`);
            }
        });
    } catch (err) {
        console.error('Error minifying JS:', err);
    }
    
    // Copy HTML and other files
    try {
        const filesToCopy = ['index.html', 'server-prod.js'];
        filesToCopy.forEach(file => {
            if (fs.existsSync(file)) {
                fs.copyFileSync(file, `dist/${file}`);
                console.log(`Copied ${file}`);
            }
        });
    } catch (err) {
        console.error('Error copying files:', err);
    }
    
    console.log('Build process completed!');
}

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Run build
build();