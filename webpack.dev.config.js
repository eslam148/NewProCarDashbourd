const path = require('path');

module.exports = {
  devServer: {
    host: 'localhost',
    port: 4200,
    hot: true,
    liveReload: true,
    client: {
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: 4200,
        protocol: 'ws'
      },
      reconnect: 5,
      logging: 'warn'
    },
    webSocketServer: {
      type: 'ws',
      options: {
        host: 'localhost',
        port: 4200
      }
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }
};
