// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
// import '/imports/ui/components/DynaText'
import './contactPage.html'

// on created
Template.contactPage.onCreated(() => {
  const instance = Template.instance()
})

// on rendered
Template.contactPage.onRendered(() => {
  const instance = Template.instance()
})

// helpers
Template.contactPage.helpers({
  helper() {
    const instance = Template.instance()
    return 'help'
  }
})

// events
Template.contactPage.events({

  //on click class
  'click .className'(event, instance) {
  }
})

// on destroyed
Template.contactPage.onDestroyed(() => {
  const instance = Template.instance()
})
