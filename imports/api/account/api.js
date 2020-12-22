import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Accounts } from 'meteor/accounts-base'
import { ValidatedMethod } from 'meteor/indesign:validated-method'
import { Access } from 'meteor/mozfet:access'
import { signUpSchema } from './schemas/signUpSchema.js'
import { updateAccountSchema } from './schemas/updateAccountSchema.js'
import users from './collection.js'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

/**
 * Validated Method to Create a User
 * @param {}  -
 * @returns {}
 **/
export const createUser = new ValidatedMethod({
  name: 'Accounts.password.createUser',
  validate: signUpSchema.validator(),
  applyOptions: {
    noRetry: true,
  },

  // method
  run({ email, username, password, firstName, lastName }) {

    // if running on the server
    if (Meteor.isServer) {

      // create user
      const userId = Accounts.createUser({ email, password, username,
          profile: {firstName, lastName} })
      Log.log(['debug', 'accounts', 'method'],
          `Created user for username ${username}, email ${email}.`)
      // return id of created user
      return userId
    }

    return undefined
  }
})

/**
 * Validated Method to Update a User
 * @param {Object} arg - { userId, email, firstName, lastName, username }
 * @returns {undefined}
 **/
export const updateUser = new ValidatedMethod({
  name: 'Accounts.updateUser',
  validate: updateAccountSchema.validator(),
  applyOptions: {
    noRetry: true,
  },

  // method
  run({ userId, email, username }) {
    Log.log(['debug', 'accounts', 'method'], `Update User`)

    // if running on the server
    if (Meteor.isServer) {

      // check for valid access
      const isAdmin = Access.isAdmin()
      if ((!isAdmin && userId) && (userId != Meteor.userId)) {
        throw new Meteor.Error(i18n.__('MFS.account.error.onlyUserAndAdminCanUpdate'))
      }

      // normalise userId
      userId = isAdmin && userId ? userId : Meteor.userId()

      // set username
      Accounts.setUsername(userId, username)
      Log.log(['debug', 'accounts', 'method'], `Set user ${userId} username to ${username}.`)

      // add email
      Accounts.addEmail(userId, email)
      Log.log(['debug', 'accounts', 'method'], `Added email ${email} to user ${userId}.`)
    }

    // return nothing
    return undefined
  }
})

/**
 * Export API by default
 **/
 export default {
   collection: users,
   create() {
     return createUser.call(arguments)
   },
   update() {
     return updateUser.call(arguments)
   }
 }
