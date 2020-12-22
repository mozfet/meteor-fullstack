import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
// import '/imports/ui/components/DynaText'
import { updateAccountSchema } from '/imports/api/account/schemas/updateAccountSchema.js'
import { updateUser } from '/imports/api/account/api.js'
// import '/imports/ui/components/spinner'
import { Access } from 'meteor/mozfet:access'
import './accountPage.html'

// on startup
Template.accountPage.onCreated(() => {
	const instance = Template.instance()

	// init state
	instance.state = {
		email: new ReactiveVar(),
		username: new ReactiveVar()
	}

	// get user id
	const userId = Meteor.userId()

	// get user email from server
	Meteor.call('mozfet:access.userEmail', userId, (error, result) => {
		if (error) {
			console.log(['error', 'access'], `${error.reason}`)
		}
		instance.state.email.set(result)
	})

	// get username from server
	Meteor.call('mozfet:access.userUsername', userId, (error, result) => {
		if (error) {
			console.log(['error', 'access'], `${error.reason}`)
		}
		instance.state.username.set(result)
	})
})

// helpers
Template.accountPage.helpers({

	// reactive doc for form
	doc() {
		const instance = Template.instance()
		return {
			email: instance.state.email.get(),
			username: instance.state.username.get()
		}
	},

	// form schema
	schema: updateAccountSchema
})

// autoform hook
AutoForm.hooks({

	// hook for this form
	updateAccount: {

		// hook for on submit
		onSubmit: function (insertDoc, updateDoc, currentDoc) {
      Log.log(['debug', 'account'], `On submit of signUpForm:`, insertDoc)
      updateUser.call(insertDoc, (error, result) => {

				// if error
        if (error) {
          Log.log(['warning', 'account'], `Update Account error -`, error.message)

					// handle existing email
          if (error.message === 'Email already exists. [403]') {
            Log.log(['warning', 'account'], `Email already exists.`)
            M.toast({html: i18n.__('MFS.account.error.emailExists')})
          }

					// handle existing username
          else if (error.message === 'Username already exists. [403]') {
            Log.log(['warning', 'account'], `Username already exists.`)
            M.toast({html: i18n.__('MFS.account.error.usernameExists')})
          }

					// handle other errors
          else {
            M.toast({html: i18n.__('MFS.account.update.failure')})
          }
        }

				// else - success
        else {
          Log.log(['debug', 'account'], `Update Account success.`)
          M.toast({html: i18n.__('MFS.account.update.success')})

					// go to update profile
          Router.go('profileUpdate')
        }
      })
      this.done()
      return false
    }
  }
})
