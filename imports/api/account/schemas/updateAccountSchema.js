// imports
import SimpleSchema from 'simpl-schema'
import { Tracker } from 'meteor/tracker'

// extend simple schema options
SimpleSchema.extendOptions(['autoform'])

// define schema
export const updateAccountSchema = new SimpleSchema({

  username: {
    type: String,
    label: i18n.__('MFS.account.form.username.label'),
    optional: false,
    autoform: {
      type: 'text',
      placeholder: i18n.__('MFS.account.form.username.placeholder')
    }
  },

  email: {
    type: String,
    label: i18n.__('MFS.account.form.email.label'),
    optional: false,
    autoform: {
      type: 'email',
      placeholder: i18n.__('MFS.account.form.email.placeholder'),
      readonly: true
    }
  },

  // newsletter: {
  //   type: Boolean,
  //   label: i18n.__('MFS.account.form.newsletter.label'),
  //   defaultValue: true
  // }
}, {tracker: Tracker})
