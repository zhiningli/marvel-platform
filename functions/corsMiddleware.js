const cors = require('cors');

const corsMiddleware = cors({
  origin: ['http://localhost:3000', 'https://your-production-domain.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
});

module.exports = corsMiddleware;