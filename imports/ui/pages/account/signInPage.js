// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
// import '/imports/ui/components/DynaText'
import AutoFrom from 'meteor/aldeed:autoform'
import '/imports/ui/components/account/signInFormEmailPassword.js'
import '/imports/ui/components/account/signInThirdParty.js'
import './signInPage.html'

Template.signInPage.events({
  // on click sign out
  'click .js-sign-out-button'(event, instance) {
    Meteor.logout(error => {
      if (error) {
        M.toast({html: i18n.__('MFS.account.signOut.failure')})
        Log.log(['error', 'account'], `Sign out error.`, error)
      }
      else {
        M.toast({html: i18n.__('MFS.account.signOut.success')})
        M.toast({html: 'Sign out succesfull.'})
        Router.go('home/currentPage=home')
      }
    })
  }
})
