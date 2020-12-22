import { Roles } from 'meteor/alanning:roles'
import { Access } from 'meteor/mozfet:access'
import { createUser } from '/imports/api/account/api.js'

/**
 * Create admin users with default passwords
 **/
const defaultPassword = '1234554321'

const admins = [
  {
    username: 'mozfet',
    email: 'info@expertbox.com',
    password: defaultPassword,
    firstName: 'Wynand',
    lastName: 'Vermeulen'
  }
]

/**
 * Create and admin user
 * @param {Object} .username -
 * @param {Object} .email -
 * @param {Object} .password -
 * @returns {}
 **/
function createAdmin({username, email, password, firstName, lastName}) {
  const admin = Access.findUserByEmail(email)
  if (!admin) {
    const userId = createUser.call({
      username, email, firstName, lastName,
      password, passwordConfirmation: password
    })
    Log.log(['information', 'accounts'], `Created user ${userId} for email `+
        `${email}.`)

    // assign admin role
		Roles.addUsersToRoles(userId, ['admin', 'user'], Roles.GLOBAL_GROUP)
		Log.log(['information', 'accounts'], `Assigned admin and user rights for`+
        `${email}.`)
  }
}

// create all admins
for (let admin of admins) {
  createAdmin(admin)
}
