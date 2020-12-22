import {Session} from 'meteor/session'
import { _ } from 'meteor/underscore'
import { Log } from 'meteor/mozfet:meteor-logs'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

const onWindowResize = function() {
  const instance = Template.instance()
  const width = $(window).width()
  let size = 'LARGE'
  if (width <= 600) {
    size = 'SMALL'
  }
  else if (width <= 992) {
    size = 'MEDIUM'
  }
  Log.log(['debug', 'screens'], `Screen side is ${size}.`)
  Session.set('screenSize', size)
}
onWindowResize()

const throttledOnWindowResize = _.throttle(onWindowResize, 200, {
  leading: false
})

$(window).resize(throttledOnWindowResize)

Template.registerHelper('largeScreen', function(obj) {
  return Session.get('screenSize') === 'LARGE'
})

Template.registerHelper('mediumScreen', function(obj) {
  return Session.get('screenSize') === 'MEDIUM'
})

Template.registerHelper('smallScreen', function(obj) {
  return Session.get('screenSize') === 'SMALL'
})
