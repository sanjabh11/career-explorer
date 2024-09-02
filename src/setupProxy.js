     const { createProxyMiddleware } = require('http-proxy-middleware');

     module.exports = function(app) {
       app.use(
         '/api',
         createProxyMiddleware({
           target: 'https://services.onetcenter.org',
           changeOrigin: true,
           pathRewrite: {
             '^/api': '/ws/online', // rewrite path
           },
         })
       );
     };
