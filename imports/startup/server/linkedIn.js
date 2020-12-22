ServiceConfiguration.configurations.upsert({
  service: "linkedin"
}, {
  $set: {
    clientId: Meteor.settings.linkedIn.clientId,
    loginStyle: "popup",
    secret: Meteor.settings.linkedIn.secret
  }
})
