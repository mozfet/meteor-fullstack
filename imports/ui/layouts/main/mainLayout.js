// import 'hammerjs'
import 'materialize-css/dist/js/materialize.js'
import { Log } from 'meteor/mozfet:meteor-logs'
import '/imports/ui/components/Layout'
import '/imports/ui/components/navbar/navbar.js'
import '/imports/ui/components/footer/footer.js'
import './mainLayout.html'
import 'meteor/mozfet:dynaview'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

Template.mainLayout.onCreated(() => {
  const instance = Template.instance()
  Log.log(['debug', 'layout'], `Main Layout instance data:`, instance.data)
})
