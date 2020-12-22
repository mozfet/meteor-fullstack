// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import './signInThirdParty.html'

// on created
Template.signInThirdParty.onCreated(() => {
  const instance = Template.instance()
})

// on rendered
Template.signInThirdParty.onRendered(() => {
  const instance = Template.instance()
})

// helpers
Template.signInThirdParty.helpers({
  helper() {
    const instance = Template.instance()
    return 'help'
  }
})

// events
Template.signInThirdParty.events({

  // on click class
  'click .js-account-signin-facebook'(event, instance) {
    Meteor.loginWithFacebook({
      requestPermissions: ['public_profile', 'email']
    }, err => {
      if (err) {
        M.toast({html:i18n.__('MFS.account.signIn.failure')})
        Log.log(['error', 'account', 'facebook'], `Unable to login using Facebook.`, err)
      } else {
        M.toast({html:i18n.__('MFS.account.signIn.success')})
      }
    })
  },

  'click .js-account-signin-biocryptology'(event) {
    event.preventDefault()
    Meteor.loginWithBiocryptology(error => {
      if (error) {
        M.toast({html: i18n.__('MFS.account.signIn.failure')})
      }
      else {
        M.toast({html: i18n.__('MFS.account.signIn.success')})
      }
    })
  },

  'click .js-account-signin-linkedin'(event) {
    event.preventDefault()
    const options = {}
    Meteor.loginWithLinkedin(options, error => {
      if (error) {
        M.toast({html: i18n.__('MFS.account.signIn.failure')})
      }
      else {
        M.toast({html: i18n.__('MFS.account.signIn.success')})
      }
    })
  }
})

// Template.signUpPage.events({

// })

// on destroyed
Template.signInThirdParty.onDestroyed(() => {
  const instance = Template.instance()
})
