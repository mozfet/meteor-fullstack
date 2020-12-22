// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
// import '/imports/ui/components/DynaText'
import './notFoundPage.html'

// on created
Template.notFoundPage.onCreated(() => {
  const instance = Template.instance()
})

// on rendered
Template.notFoundPage.onRendered(() => {
  const instance = Template.instance()
})

// helpers
Template.notFoundPage.helpers({
  helper() {
    const instance = Template.instance()
    return 'help'
  }
})

// events
Template.notFoundPage.events({

  //on click class
  'click .className'(event, instance) {
  }
})

// on destroyed
Template.notFoundPage.onDestroyed(() => {
  const instance = Template.instance()
})
