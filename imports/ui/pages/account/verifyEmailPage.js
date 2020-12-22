// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import '/imports/ui/components/DynaText'
import './verifyEmailPage.html'

// on created
Template.verifyEmailPage.onCreated(() => {
  const instance = Template.instance()
  instance.state = {
    isVerified: new ReactiveVar(false),
    reason: new ReactiveVar('Busy verifying email.')
  }
})

// on rendered
Template.verifyEmailPage.onRendered(() => {
  const instance = Template.instance()

  // verify the token
  const token = Router.get('token')
  Log.log(['debug', 'accounts'], `Verify email token ${token}.`)
  Accounts.verifyEmail(token, error => {
    if (error) {
      Log.log(['warning', 'accounts'], `Email verification error:`,
        error.reason)
      instance.state.reason.set(error.reason)
      M.toast({html: i18n.__('account.verifyEmail.failure')})
    }
    else {
      instance.state.isVerified.set(true)
      M.toast({html: i18n.__('account.verifyEmail.success')})
    }
  })
})
