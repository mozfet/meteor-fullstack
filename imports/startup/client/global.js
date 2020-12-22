/**
 * Always subscribe to your own stuff, subscribe to the stuff of the username reactively
 * @exports {Object} subscriptions - containing profile, items and feedback subscription handlers
 **/

// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { Access } from 'meteor/mozfet:access'
import { check, Match } from 'meteor/check'

export let globalSubscriptionHandler

// autorun when user changes
Tracker.autorun(() => {

  // get reactive external username from session
  const user = Meteor.user()

  // if user is defined
  if (user) {

    // subscribe to global publication
    globalSubscriptionHandler = Meteor.subscribe('global', user.username)
  }

  // else
  else {

    // if subscription handler exists
    if (globalSubscriptionHandler) {

      // stop the subscription
      globalSubscriptionHandler.stop()
    }
  }
})

// register global template helper
Template.registerHelper('isGlobalSubscriptionReady', function() {
  return globalSubscriptionHandler?globalSubscriptionHandler.ready():false
})

// register global template helper
Template.registerHelper('isAdmin', function() {
  const result = Access.isAdmin()
  Log.log(['debug', 'global'], `Current user is ${result?'admin':'not admin'}.`)
  return result
})

// register global template helper
Template.registerHelper('or', function(a, b) {
  return a || b
})

// register global template helper
Template.registerHelper('and', function(a, b) {
  return a && b
})

// register global template helper
Template.registerHelper('equals', function(a, b) {
  return a === b
})

// register global template helper
Template.registerHelper('notEquals', function(a, b) {
  return a !== b
})

// register global template helper
Template.registerHelper('instance', function() {
  const instance = Template.instance()
  return instance
})

// register global template helper
Template.registerHelper('state', function() {
  const instance = Template.instance()
  return instance.state
})
