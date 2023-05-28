export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '3t0-5!cr3@'
}
