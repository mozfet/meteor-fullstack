import { Log } from 'meteor/mozfet:meteor-logs'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

if (Meteor.settings.facebook) {
  ServiceConfiguration.configurations.upsert({
    service: "facebook"
  }, {
    $set: {
      appId: Meteor.settings.facebook.appId,
      loginStyle: "popup",
      secret: Meteor.settings.facebook.secret
    }
  })
}
