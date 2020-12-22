// imports
import { Log } from 'meteor/mozfet:meteor-logs'
import '/imports/startup/client'
import '/imports/ui/layouts/main/mainLayout.js'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)
