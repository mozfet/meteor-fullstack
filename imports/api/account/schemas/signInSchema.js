// imports
import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'

// extend simple schema options
SimpleSchema.extendOptions(['autoform'])

// define schema
export const signInSchema = new SimpleSchema({

  email: {
    type: String,
    label: i18n.__('MFS.account.form.email.label'),
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      type: 'email',
      placeholder: i18n.__('MFS.account.form.email.placeholder')
    }
  },

  password: {
    type: String,
    label: i18n.__('MFS.account.form.password.label'),
    autoform: {
      type: 'password',
      placeholder: i18n.__('MFS.account.form.password.placeholder')
    }
  }
}, {tracker: Tracker})
