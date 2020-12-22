// imports
import 'materialize-css/dist/js/materialize.js'
import 'meteor/mozfet:dynaview'
import '/imports/ui/components/navbar/navbar.js'
import '/imports/ui/components/footer/footer.js'
import '/imports/ui/components/account/signInFormEmailPassword.js'
import '/imports/ui/components/account/signInThirdParty.js'
import '/imports/ui/pages/account/signInPage.js'
import './userLayout.html'

// on created
Template.userLayout.onCreated(function() {
  const instance = Template.instance()
  // DocHead.removeDocHeadAddedTags()
  // DocHead.setTitle(i18n.__('MFS.title'))
})

// helpers
Template.userLayout.helpers({
  data() {
    const instance = Template.instance()
    return instance.data.data
  }
})
