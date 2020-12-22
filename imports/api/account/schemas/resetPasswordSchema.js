// imports
import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'

SimpleSchema.extendOptions(['autoform'])

// define schema
export const forgotPasswordSchema = new SimpleSchema({

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
}, {tracker: Tracker})
