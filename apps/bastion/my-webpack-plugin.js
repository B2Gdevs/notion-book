// my-webpack-plugin.js
const { exec } = require('child_process');

class MyWebpackPlugin {
  apply(compiler) {
    compiler.hooks.invalid.tap('MyWebpackPlugin', (filename, changeTime) => {
      console.log(`File changed: ${filename}`);
      console.log('Running custom pre-script...');
      exec('node pre-script.js', (err, stdout, stderr) => {
        if (err) {
          console.error('Error executing pre-script:', err);
          return;
        }
        console.log(stdout);
      });
    });
  }
}

module.exports = MyWebpackPlugin;
