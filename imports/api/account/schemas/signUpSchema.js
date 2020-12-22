// imports
import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'

// extend simple schema options
SimpleSchema.extendOptions(['autoform'])

// define schema
export const signUpSchema = new SimpleSchema({

  username: {
    type: String,
    label: i18n.__('MFS.account.form.username.label'),
    autoform: {
      placeholder: i18n.__('MFS.account.form.username.placeholder')
    }
  },

  email: {
    type: String,
    label: i18n.__('MFS.account.form.email.label'),
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      type: 'email',
      placeholder: i18n.__('MFS.account.form.email.placeholder')
    }
  },

  firstName: {
    type: String,
    label: i18n.__('MFS.account.form.firstName.label'),
    autoform: {
      placeholder: i18n.__('MFS.account.form.firstName.placeholder')
    }
  },

  lastName: {
    type: String,
    label: i18n.__('MFS.account.form.lastName.label'),
    autoform: {
      placeholder: i18n.__('MFS.account.form.lastName.placeholder')
    }
  },

  password: {
    type: String,
    label: i18n.__('MFS.account.form.password.label'),
    min: 10,
    autoform: {
      type: 'password',
      placeholder: i18n.__('MFS.account.form.password.placeholder')
    }
  },

  passwordConfirmation: {
    type: String,
    label: i18n.__('MFS.account.form.passwordConfirmation.label'),
    min: 10,
    custom() {
      if (this.value !== this.field('password').value) {
        return "passwordMismatch";
      }
    },
    autoform: {
      type: 'password',
      placeholder: i18n.__('MFS.account.form.passwordConfirmation.placeholder')
    }
  },

  // 'newsletter': {
  //   type: Boolean,
  //   label: i18n.__('MFS.account.form.newsletter.label'),
  //   defaultValue: true
  // }
}, {tracker: Tracker})
