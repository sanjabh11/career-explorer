     const { createProxyMiddleware } = require('http-proxy-middleware');

     module.exports = function(app) {
       app.use(
         '/api/ws', // Note the updated path to match your axios baseURL
         createProxyMiddleware({
           target: 'https://services.onetcenter.org',
           changeOrigin: true,
         })
       );
     };
     