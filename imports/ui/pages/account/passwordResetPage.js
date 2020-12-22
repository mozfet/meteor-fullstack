// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'
import AutoFrom from 'meteor/aldeed:autoform'
import { resetPasswordSchema } from '/imports/api/account/schemas/resetPasswordSchema.js'
import './passwordResetPage.html'

// on rendered
Template.passwordResetPage.onRendered(() => {
  const instance = Template.instance()
  Materialize.updateTextFields()
})

// helpers
Template.passwordResetPage.helpers({

  // form schema
  schema: resetPasswordSchema
})

AutoForm.hooks({
  passwordResetForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      const token = Router.getParam('token')
      Accounts.resetPassword(token, insertDoc.password,
        error => {
          if (error) {
            M.toast({html: i18n.__('account.passwordReset.failure')})
          }
          else {
            M.toast({html: i18n.__('account.passwordReset.success')})
            Router.go('home')
          }
        }
      )
      this.done()
      return false
    }
  }
})
