import { Mongo } from 'meteor/mongo'
import { Access } from 'meteor/mozfet:access'
import to from 'to-case'

export const users = Mongo.Collection.get('users')
export default users

users.before.insert(function (userId, doc) {
  if (Meteor.isServer) {
    Log.log(['debug', 'account', 'collection', 'hook'], `Before insert doc:`, doc)
    let usernameBase = Access.userUsername(doc)
    Log.log(['debug', 'account', 'collection', 'hook'], `usernameBase:`, usernameBase)
    if (_.isUndefined(usernameBase)) {
      const email = Access.userEmail(doc)
      Log.log(['debug', 'account', 'collection', 'hook'], `email:`, email)
      const dirtyUsername = email.split('@', 1)[0]
      Log.log(['debug', 'account', 'collection', 'hook'], `dirtyUsername:`, dirtyUsername)
      usernameBase = to.slug(dirtyUsername)
    }
    Log.log(['debug', 'account', 'collection', 'hook'], `usernameBase:`, usernameBase)

    // try 100 times to assign username
    let taken = true
    let username = usernameBase
    for (let i = 0; i < 100; i++) {

      // if username is taken
      if (taken) {
        Log.log(['debug', 'account', 'collection', 'hook'], `test for existing username:`, username)

        // find user by this username
        const count = users.find({username}).count()
        Log.log(['debug', 'account', 'collection', 'hook'], `existing username count:`, count)

        // taken is true if count is greater than zero
        taken = count > 0
        Log.log(['debug', 'account', 'collection', 'hook'], `existing username is ${taken?'taken':'not taken'}.`)
      }

      // if username is not taken
      if (!taken) {

        // assign username to user
        Log.log(['debug', 'account', 'collection', 'hook'], `assign username:`, username)
        doc.username = username

        // break out of assign username loop
        break;
      }

      // modify the username
      username = `${usernameBase}-${i}`
    }
  }
})
