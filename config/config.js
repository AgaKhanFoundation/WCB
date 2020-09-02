module.exports = {
  production: {
    'database': 'wcb',
    'host': process.env.MYSQL_HOST,
    'dialect': 'mysql',
    'port': 3306,
    'username': process.env.MYSQL_USERNAME,
    'password': process.env.MYSQL_PASSWORD
  },
  staging: {
    'database': 'wcb',
    'host': process.env.MYSQL_HOST,
    'dialect': 'mysql',
    'port': 3306,
    'username': process.env.MYSQL_USERNAME,
    'password': process.env.MYSQL_PASSWORD
  },
  development: {
    'dialect': 'sqlite',
    'storage': './dev.sqlite'
  },
  test: {
    'dialect': 'sqlite',
    'logging': false,
    'storage': ':memory:'
  }
}
