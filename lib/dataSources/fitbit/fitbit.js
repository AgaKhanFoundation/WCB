var request = require('request')
var moment = require('moment')
const models = require('../../models')
var config = require('./config.json')

var Fitbit = function (user) {
  this.user = user
  this.instance = null
  this.userTokens = null
}

// Fetch record of this user from the database
// self.instance represents fitbit user's model instance
Fitbit.prototype.fetchTokens = function () {
  var self = this

  return models.db.fitbit.findAll({
    where: {
      fitbit_id: self.user
    }
  }).then(res => {
    if (res.length === 1) {
      self.instance = res[0]
      self.userTokens = self.instance.dataValues
      return self.userTokens
    } else {
      console.error('User with fitbit id=' + self.user + ' not found')
    }
  })
}
// Fetch activity data from fitbit servers.
// Use refresh token to get new access token if the current token is expired
Fitbit.prototype.fetchData = function () {
  var self = this
  self.fetchTokens().then(res => {
    if (self.userTokens) {
      if (moment().unix() >= moment(self.userTokens.expires_at, 'YYYYMMDDTHH:mm:ss').unix()) {
        console.log('Tokens are expired for user: ' + self.user + '. Need to refresh them')
        console.log(config)
        self.updateTokens()
        self.request()
      } else {
        console.log('Refresh token is still valid. Expires at: ' + self.userTokens.expires_at)
        self.request()
      }
    }
  })
}

// Get new access and refresh tokens from fitbit using the current refresh token
// Save new token and update expiry time in the database
Fitbit.prototype.updateTokens = function () {
  var self = this
  request({
    uri: config.uris.tokenUri + config.uris.tokenPath,
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + new Buffer(config.creds.clientID + ':' + config.creds.clientSecret).toString('base64')
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: self.userTokens.refresh_token
    }
  }, function (err, res, body) {
    if (err) {
      console.error('Error while refreshing token ' + err.message)
    }
    try {
      console.log('Result of refresh tokens call ' + body)
      var newTokens = JSON.parse(body)
      console.log('Got token: ' + JSON.stringify(newTokens))
      var expiresAt = moment().add(newTokens.expires_in, 'seconds').format('YYYY-MM-DD HH:mm:ss')
      console.log('New token expires at: ' + expiresAt)

      self.instance.update({
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_at: expiresAt
      }).then((result) => {
        console.log('Saved new access and refresh tokens')
      })
    } catch (err) {
      console.error('Error while saving new token ' + err.message)
    }
  })
}

// Pull today's activity data fot the user
Fitbit.prototype.request = function () {
  var self = this
  var today = moment().format('YYYY-MM-DD')
  request({
    uri: 'https://api.fitbit.com/1/user/-/activities/steps/date/' + today + '/1d.json',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + self.userTokens.access_token
    }
  }, function (err, res, body) {
    if (err) {
      console.error('Error while fetching data for user' + self.user + ' Error: ' + err.message)
    }
    try {
      console.log('Result of fetch data call ' + body)
      // TODO: Save/update the record in database
    } catch (err) {
      console.error('Error while fetching data for user ' + err.message)
    }
  })
}

module.exports = Fitbit
