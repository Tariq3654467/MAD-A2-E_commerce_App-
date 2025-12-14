const app = require('./index');
const { connectDB } = require('./index');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Start server only if not in serverless environment
if (require.main === module) {
  // Connect to MongoDB first, then start server
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
      });
    })
    .catch((err) => {
      console.error('❌ Failed to start server:', err);
      process.exit(1);
    });
}

module.exports = app;

