// imports
import { Meteor } from 'meteor/meteor'
import { Log } from 'meteor/mozfet:meteor-logs'
import '/imports/startup/server'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)
