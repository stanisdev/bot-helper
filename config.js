module.exports = function() {
  return {
    root_dir: __dirname,
    port: process.env.PORT || 3045,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjkxMzg0MDM0LCJwaG9uZSI6IjU5NjMiLCJwYXNzd29yZCI6IiQyYSQxMCQxQi90Y2lYNXFTSDlEUDF4aUdjSmx1WngyOHRIeXAxYzExVzk0NVVkd0d1dG4wTE9hZnZ0SyIsImlzQm90Ijp0cnVlLCJjb3VudHJ5Ijp0cnVlLCJpYXQiOjE1MTA5MDE1NjJ9.evGedcACm1Wv4qfmsh6aBxaw7R21S-y7wpNKVmVh5LU',
    api_url: process.env.API_URL || 'http://77.235.20.133:3000',
    db_name: process.env.DB_NAME || 'users_db',
    bot_name: 'Ваш персональный помощник',
    hash: '060711473f74be8c62e1b5cebfd7f994d63e4d35338e07b316cb4daff0dc5a3c82024d7b7020b72feb5eb95d8fd84766489f6bd2c97a65482a7664db0b7b60ad',
    username: 'admin',
    secret: 'abcdefg12345'
  };
};
