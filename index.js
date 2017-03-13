const server = require('./lib/server')

function main () {
  return server.listen(7777)
}

if (require.main === module) {
  main()
}

module.exports = main
