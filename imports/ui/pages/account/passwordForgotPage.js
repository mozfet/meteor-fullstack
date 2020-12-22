// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
// import '/imports/ui/components/DynaText'
import AutoFrom from 'meteor/aldeed:autoform'
import { forgotPasswordSchema } from
    '/imports/api/account/schemas/forgotPasswordSchema.js'
import './passwordForgotPage.html'

// on rendered
Template.passwordForgotPage.onRendered(() => {
  const instance = Template.instance()
})

// helpers
Template.passwordForgotPage.helpers({

  // form schema
  schema: forgotPasswordSchema
})

AutoForm.hooks({
  passwordForgotForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      Accounts.forgotPassword(
        {
          email: insertDoc.email
        },
        error => {
          if (error) {
            M.toast({html: i18n.__('MFS.account.passwordForgot.failure')})
          }
          else {
            M.toast({html: i18n.__('MFS.account.passwordForgot.success')})
            Router.go('home')
          }
        }
      )
      this.done()
      return false
    }
  }
})
