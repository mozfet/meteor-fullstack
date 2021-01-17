import { Roles } from 'meteor/alanning:roles'
import { Access } from 'meteor/mozfet:access'
import Account from '/imports/api/account/api.js'
import fullstack from '/fullstack-config.json'
import { Log } from 'meteor/mozfet:meteor-logs'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

/**
 * Default Password is 1234554321
 **/
const DEFAULT_PASSWORD = '1234554321'

/**
 * Call Startup Code defined in this ES6 module is called on loading of this module
 */
startup()

/**
 * Create admin role and admin users as per fullstack config if they do not exist.
 */
function startup() {

  // create admin and user roles unless they allready exists
  Roles.createRole(Account.roleNames.admin, {unlessExists: true})
  Roles.createRole(Account.roleNames.user, {unlessExists: true})

  // for each admin
  const admins = fullstack.administrators.forEach(admin => {

    // use defined password if provided else use default password
    admin.password = admin.password?admin.password:DEFAULT_PASSWORD

    // set password confirmation to password
    admin.passwordConfirmation = admin.password

    // return admin
    return admin
  })

  // create admin user for each admin if the admin user does not already exist
  fullstack.administrators.forEach(admin => {

    // create admin
    createAdmin(admin)
  })
}


/**
 * Create and admin user using Account api to call cross platform Account API which in turn makes use of validated
 * method createUser.
 * @param {Object} options - required
 * @param {String} options.username - required
 * @param {String} options.email - required
 * @param {String} options.password - required
 * @param {String} options.passwordConfirmation - requires
 * @param {String} options.firstName - required
 * @param {String} options.lastName - required
 **/
function createAdmin(_options) {
  Log.log(['debug', 'accounts'], 'createAdmin:', _options)

  // clone options for safe mutation
  const options = Object.assign({}, _options)

  // use defined password if provided else use default password
  options.password = options.password?options.password:DEFAULT_PASSWORD

  // set password confirmation to password
  options.passwordConfirmation = options.password

  // get email from options
  const email = options.email

  // find admin user based on email address
  const admin = Access.findUserByEmail(email)
  Log.log(['debug', 'accounts'], `user for email ${email}:`, admin)

  // admin is not found
  if (!admin) {

    // create new user using account cross platform api
    const userId = Account.create(options)
    Log.log(['information', 'accounts'], `Created user ${userId} for email ${email}.`)

    // assign admin role
    Roles.addUsersToRoles(userId, [Account.roleNames.admin, Account.roleNames.user], Roles.GLOBAL_GROUP)
    Log.log(['information', 'accounts'], `Assigned admin and user rights for ${email}.`)
  }
}

