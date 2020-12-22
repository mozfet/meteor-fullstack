// imports
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { _ } from 'meteor/underscore'
import { Roles } from 'meteor/alanning:roles'
import { Log } from 'meteor/mozfet:meteor-logs'
import { Access } from 'meteor/mozfet:access'
import Layout from '/imports/ui/components/Layout'
import '/imports/ui/layouts/main/mainLayout.js'
import '/imports/ui/pages/home/homePage.js'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

// init router
Router.init({
  home: 'home',
  onError: function () {
    Router.go('notFound')
  }
})

// get the username of current user and set username on the route if it not provided in the route
function normaliseUsername() {
  let username = Router.get('username')
  if (_.isUndefined(username)) {
    const userId = Meteor.userId()
    username = Access.userUsername(userId)
    Router.set('username', username)
  }
}

// register routes
Router.register({
  home: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing home:', parameters)
    Layout.set('body', 'homePage')
    Router.set('currentPage', 'home')
  },
  terms: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing terms:', parameters)
    await import('/imports/ui/pages/terms/termsPage.js')
    Router.set('currentPage', 'terms')
    Layout.set('body', 'termsPage')
  },
  contact: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing terms:', parameters)
    await import('/imports/ui/pages/contact/contactPage.js')
    Router.set('currentPage', 'contact')
    Layout.set('body', 'contactPage')
  },
  account: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing account:', parameters)
    await import('/imports/ui/pages/account/accountPage.js')
    normaliseUsername()
    Layout.set('body', 'accountPage')
    Router.set('currentPage', 'account')
  },
  signUp: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing signUp:', parameters)
    await import('/imports/ui/pages/account/signUpPage.js')
    Layout.set('body', 'signUpPage')
    Router.set('currentPage', 'signUp')
  },
  forgotPassword: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing forgotPassword:', parameters)
    await import('/imports/ui/pages/account/passwordForgotPage.js')
    Layout.set('body', 'passwordForgotPage')
    Router.set('currentPage', 'forgotPassword')
  },
  passwordReset: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing passwordReset:', parameters)
    await import('/imports/ui/pages/account/passwordResetPage.js')
    Layout.set('body', 'passwordResetPage')
    Router.set('currentPage', 'resetPassword')
  },
  verifyEmail: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing verifyEmail:', parameters)
    await import('/imports/ui/pages/account/verifyEmailPage.js')
    Layout.set('body', 'verifyEmailPage')
    Router.set('currentPage', 'verifyEmail')
  },
  signIn: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing signIn:', parameters)
    await import('/imports/ui/pages/account/signInPage.js')
    Layout.set('body', 'signInPage')
    Router.set('currentPage', 'signIn')
  },
  message: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing message thread:', parameters)
    Router.set('currentPage', 'messages')
    Layout.set('body', 'MessageThread')
  },
  messages: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing messages:', parameters)
    Router.set('currentPage', 'messages')
    Layout.set('body', 'MessagingView')
  },
  admin: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing admin:', parameters)
    await import('/imports/ui/pages/admin/adminPage.js')
    Router.set('currentPage', 'admin')
    Layout.set('body', 'adminPage')
  },
  logs: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing admin:', parameters)
    Router.set('currentPage', 'logs')
    Layout.set('body', 'meteorLogs')
  },
  notFound: async parameters => {
    Log.log(['debug', 'routing'], 'Viewing notFound:', parameters)
    await import('/imports/ui/pages/notFound/notFoundPage.js')
    Router.set('currentPage', 'notFound')
    Layout.set('body', 'notFoundPage')
  }
})
