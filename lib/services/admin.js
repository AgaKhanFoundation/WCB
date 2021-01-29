const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(`${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)),
  databaseURL: `https://${process.env.FIREBASE_NAME}.firebaseio.com`
})

const auth = admin.auth()

module.exports = {auth}
