// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import 'materialize-css/dist/js/materialize.js'
// import '/imports/ui/components/DynaText'
import AutoFrom from 'meteor/aldeed:autoform'
import '/imports/api/cdn'
import { Log } from 'meteor/mozfet:meteor-logs'
import { signUpSchema } from '/imports/api/account/schemas/signUpSchema.js'
import { createUser } from '/imports/api/account/api.js'
import './signUpPage.html'

AutoForm.hooks({
  signUpForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      Log.log(['debug', 'account'], `On submit of signUpForm:`, insertDoc)
      createUser.call(insertDoc, (error, result) => {

        if (error) {
          Log.log(['warning', 'account'], `SignUp error -`, error.message)
          if (error.message === 'Email already exists. [403]') {
            Log.log(['warning', 'account'], `Email already exists.`)
            M.toast({html: i18n.__('MFS.account.error.emailExists')})
          }
          else if (error.message === 'Username already exists. [403]') {
            Log.log(['warning', 'account'], `Username already exists.`)
            M.toast({html: i18n.__('MFS.account.error.usernameExists')})
          }
          else {
            M.toast({html: i18n.__('MFS.account.signUp.failure')})
          }
        }
        else {
          Log.log(['debug', 'account'], `SignUp success.`)
          M.toast({html: i18n.__('MFS.account.signUp.success')})

          Log.log(['debug', 'accounts', 'method'], `SignIn user ${insertDoc.username}`)
          Meteor.loginWithPassword(insertDoc.username, insertDoc.password)

          if (Router.get('currentPage') === 'signUp') {
            Router.go('profile')
          }
        }
      })
      this.done()
      return false
    }
  }
})

// helpers
Template.signUpPage.helpers({

  // form schema
  schema: signUpSchema
})
