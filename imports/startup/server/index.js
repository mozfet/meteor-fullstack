import '/imports/startup/both'
import './account.js'
import './linkedIn.js'
import './facebook.js'
import './publications.js'
import { Log } from 'meteor/mozfet:meteor-logs'

Log.log(['debug', 'load'], `Loading module ${module.id}.`)