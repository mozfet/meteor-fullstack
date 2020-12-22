// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Access } from 'meteor/mozfet:access'
import './accountOverviewCard.html'

// on created
Template.accountOverviewCard.onCreated(() => {
  const instance = Template.instance()
})

// on rendered
Template.accountOverviewCard.onRendered(() => {
  const instance = Template.instance()
})

// events
Template.accountOverviewCard.events({

  //on click class
  'click .js-sign-out-button'(event, instance) {
    Meteor.logout(error => {
      if (error) {
        M.toast({html: 'Sign out error.'})
        Log.log(['error', 'account'], `Sign out error.`, error)
      }
      else {
        M.toast({html: 'Sign out succesfull.'})
      }
    })
  }
})

// on destroyed
Template.accountOverviewCard.onDestroyed(() => {
  const instance = Template.instance()
})
