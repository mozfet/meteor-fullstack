/**
 * Resolve either a local file or cdn url depending on the environment.
 * @usage - in settings.js:
 * {
 *   "public": {
 *     "host": {
 *       "cdnUrl": "https://d19s2oyhmlvaz6.cloudfront.net"
 *      }
 *    }
 * }
 * @usage - file system: put sub paths on cdn and public folder
 * @usage - in client or server js:
 * import cdn from '/imports/cdn'
 * const wowUrl = cdn.url('/images/wow.png')
 * @usage - in client or server js:
 * import { cdnUrl } from '/imports/cdn/cdn.js'
 * const wowUrl = cdnUrl('images/wow.png')
 * @param {String} path - to be prefix with cdn host or not,
 * e.g. 'images/wow.png' - note no initial slash!
 * @returns {String} the prefixed or non-prefixed path
 **/
export function cdnUrl (path) {
  // if (Meteor.isProduction && !Meteor.isCordova &&
  //     Meteor.settings.public.host.cdnUrl) {
  //   return Meteor.settings.public.host.cdnUrl+'/'+path;
  // }
  // else {
    return path;
  // }
}

// export default
export default {
  url: cdnUrl
}

/**
 * Global blaze template helper to resolve a local or cdn url
 * depending on the environment.
 * @usage - in client js : import '/imports/api/cdn'
 * @usage - in client html : {{cdnUrl 'images/wow.png'}}
 **/
if (Meteor.isClient) {
  Template.registerHelper('cdnUrl', function(path) {
    return cdnUrl(path)
  })
}
