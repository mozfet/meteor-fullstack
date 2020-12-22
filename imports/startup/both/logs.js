import { Log } from 'meteor/mozfet:meteor-logs'

if (Meteor.isClient) {
  Log.messageIndent(25)
}
if (Meteor.isServer) {
  Log.messageIndent(27)
}

Log.color('error', 'white', 'red')
Log.color('warning', 'white', 'orange')
Log.color('information', 'black', 'green')
Log.color('debug', 'black', 'yellow')
Log.color('route', 'white', 'orange')
Log.color('account', 'yellow', 'green')
Log.color('startup', 'green', 'white')
Log.color('load', 'green', 'white')
Log.color('locale', 'purple', 'white')
Log.color('layout', 'blue', 'white')
