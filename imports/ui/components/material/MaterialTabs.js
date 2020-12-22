// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import './tabs.html'

// on created
Template.MaterialTabs.onCreated(() => {
  const instance = Template.instance()
  instance.state = {}
})

// on rendered
Template.MaterialTabs.onRendered(() => {
  const instance = Template.instance()
  const tabsQuery = instance.$('.tabs')
  instance.state.tabsInstance = M.Tabs.init(tabsQuery.get(0))
})

// helpers
Template.MaterialTabs.helpers({
  helper() {
    const instance = Template.instance()
    return 'help'
  }
})

// events
Template.MaterialTabs.events({

  //on click class
  'click .tabs li'(event, instance) {
    Session.set('tabChanged', Date.now());
  }
})

// on destroyed
Template.MaterialTabs.onDestroyed(() => {
  const instance = Template.instance()
  instance.state.tabsInstance.destroy()
})
