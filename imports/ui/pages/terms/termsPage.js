// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
// import '/imports/ui/components/DynaText'
import './termsPage.html'

// on created
Template.termsPage.onCreated(() => {
  const instance = Template.instance()
})

// on rendered
Template.termsPage.onRendered(() => {
  const instance = Template.instance()
})

// helpers
Template.termsPage.helpers({
  helper() {
    const instance = Template.instance()
    return 'help'
  }
})

// events
Template.termsPage.events({

  //on click class
  'click .className'(event, instance) {
  }
})

// on destroyed
Template.termsPage.onDestroyed(() => {
  const instance = Template.instance()
})
