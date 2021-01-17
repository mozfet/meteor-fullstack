import { Log } from 'meteor/mozfet:meteor-logs'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

if (Meteor.settings.linkedIn) {
  ServiceConfiguration.configurations.upsert({
    service: "linkedin"
  }, {
    $set: {
      clientId: Meteor.settings.linkedIn.clientId,
      loginStyle: "popup",
      secret: Meteor.settings.linkedIn.secret
    }
  })
}


