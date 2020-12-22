// imports
import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'

// extend simple schema options
SimpleSchema.extendOptions(['autoform'])

// define schema
export const forgotPasswordSchema = new SimpleSchema({
  email: {
    type: String,
    label: i18n.__('MFS.account.form.email.label'),
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      type: 'email',
      placeholder: i18n.__('MFS.account.form.email.placeholder')
    }
  },
}, {tracker: Tracker})
