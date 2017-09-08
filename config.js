const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/sea-wars-server'
  },
  static: {
    client: '/client/dist/',
    node: '/client/node_modules/'
  }
};

module.exports = config;
