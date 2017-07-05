module.exports = {
  'migrations-path': 'lib/migrations',
  'models-path': 'lib/models',
  'database': 'wcb',
  'host': 'localhost',
  'dialect': 'mysql',
  'port': 3306,
  'username': process.env.username,
  'password': process.env.password
}
