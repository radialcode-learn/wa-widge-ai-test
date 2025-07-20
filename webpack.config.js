const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const enableObfuscation = process.env.OBFUSCATE === 'true';
  
  // Conditionally load obfuscator
  let JavaScriptObfuscator;
  if (enableObfuscation) {
    try {
      JavaScriptObfuscator = require('webpack-obfuscator');
    } catch (e) {
      console.warn('Obfuscation disabled: webpack-obfuscator not available');
    }
  }
  
  return {
    entry: {
      'wa-widget': './src/wa-widget.js',
      'wa-widget.min': './src/wa-widget.js'
    },
    
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
      library: 'WhatsAppWidget',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true
    },
    
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    
    plugins: [
      new CleanWebpackPlugin(),
      
      // Copy demo HTML files if they exist
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'home.html',
            to: 'demo.html',
            noErrorOnMissing: true,
            transform(content) {
              // Update script src to use built version
              return content.toString().replace(
                './wa-widget.js',
                './wa-widget.min.js'
              );
            }
          }
        ]
      }),
      
      // Generate HTML for testing
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        chunks: ['wa-widget.min']
      }),
      
      // Conditionally add obfuscation
      ...(isProduction && enableObfuscation && JavaScriptObfuscator ? [
        new JavaScriptObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false
        }, ['wa-widget.min.js'])
      ] : [])
    ],
    
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          test: /\.min\.js$/,
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
              pure_funcs: isProduction ? ['console.log', 'console.info'] : []
            },
            mangle: {
              reserved: ['WhatsAppWidget']
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    },
    
    devServer: {
      static: {
        directory: path.join(__dirname, 'build')
      },
      compress: true,
      port: 3000,
      open: true,
      hot: true
    },
    
    resolve: {
      extensions: ['.js', '.json']
    },
    
    externals: isProduction ? {
      // Don't bundle QRCode library in production, load from CDN
      'qrcode': 'QRCode'
    } : {}
  };
};