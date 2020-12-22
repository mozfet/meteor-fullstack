// imports
import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { _ } from 'meteor/underscore'

// helper function to keep things DRY
function publishUser(publications, userId, targetUserId) {
  Log.log(['debug', 'publish', 'global'], `publishUser:`, publications, userId, targetUserId)

  // if targetUserId is not supplied, target is user
  targetUserId = targetUserId?targetUserId:userId
  Log.log(['debug', 'publish', 'global'], `targetUserId`, targetUserId)

  // if user id equals target user id
  if (userId === targetUserId) {
    publications.push(Meteor.users.find({_id: targetUserId}))
  }

  // return publications
  return publications
}

/**
 * Global publication for client, meant to be used reactively with changing
 * username as different profile are viewed
 * @param {String|undefined} externalProfileUsername - username of external profile
 * @returns {}
 **/
Meteor.publish('global', function () {

  // define array of cursors
  const result = []

  // publish logged in user
  const userId = this.userId
  if (userId) {
    publishUser(result, userId)
  }

  // return array of cursors
  return result
})
