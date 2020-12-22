// imports
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Log } from 'meteor/mozfet:meteor-logs'
import 'meteor/mozfet:materialize-icons'
import './navbar.html'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

// on rendered
Template.navbar.onRendered(() => {
  const instance = Template.instance()

  // init state
  instance.state = {}

  // init navbar
  const sidenavQuery = $(".sidenav").get(0)
  instance.state.sidenavInstance = M.Sidenav.init(sidenavQuery)

  // init dropdown button
  const dropdownElement = instance.$('.dropdown-trigger').get(0)
  instance.state.dropdownInstance = M.Dropdown.init(dropdownElement,
      {constrainWidth: false})
})

// helpers
Template.navbar.helpers({
	activePage() {
    return Router.get('activePage')
	},
})

// on destroyed
Template.navbar.onDestroyed(() => {
  const instance = Template.instance()
  if (instance.state.dropdownInstance) {
    instance.state.dropdownInstance.destroy()
  }
})

// navbar item helpers
Template.navbarItem.helpers({
	active() {
    const instance = Template.instance()
		const activePageName = Router.get('activePage')
		const pageName = instance.data.pageName
		let result = activePageName === pageName?'active':''
		return result
	}
})

const eventHandlers = {
  'click .js-signInOut'(event) {
    const instance = Template.instance()
    event.preventDefault()
    event.stopImmediatePropagation()
    Log.log(['debug', 'account'], `Clicked on SignInOut`)

    // close the sidenav
    const sidenavElement = $(".sidenav").get(0)
    const sidenavInstance = M.Sidenav.getInstance(sidenavElement);
    sidenavInstance.close()

    // if user is signed in
    if (Meteor.userId()) {

      Log.log(['debug', 'account'], `Logging out.`)

      // sign out
      Meteor.logout()

      // toast
      M.toast({html: i18n.__('MFS.account.signOut.success')})

      // go home
      Router.go('#home')
    }

    // else - user if not signed in
    else {

      Log.log(['debug', 'account'], `Logging in.`)

      // define signin options - require permissions for more than lite profile
      const options = {}

      // go to signin page
      Router.go('#signIn')
    }
  }
}

Template.navbar.events(eventHandlers)
Template.navbarItemSignIn.events(eventHandlers)
Template.navbarItemSignInOut.events(eventHandlers)
