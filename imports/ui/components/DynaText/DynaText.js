// imports
import { Template } from 'meteor/templating'
import { ReactiveVar} from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import './DynaText.html'

// constants
const smallestHeaderFontsSize = 120
const largestHeaderFontSize = 200
const numberOfHeaders = 4
const stepDown = (largestHeaderFontSize - smallestHeaderFontsSize) /
    (numberOfHeaders)

const styleSwitch = (small, medium, large) => {
  const size = Session.get('screenSize')
  switch(size) {
    case 'SMALL': return `font-size: ${small}%;`
    case 'MEDIUM': return `font-size: ${medium}%;`
    case 'LARGE': return `font-size: ${large}%;`
    default: return `font-size: ${large}%;`
  }
}

const stepDownLevel = (level) => {
  const large = largestHeaderFontSize - stepDown * level
  const medium = large - stepDown
  const small = medium - stepDown
  return styleSwitch(small, medium, large)
}

const tagSwitch = (tag) => {
  switch(tag) {
    case 'h1': return stepDownLevel(0)
    case 'h2': return stepDownLevel(1)
    case 'h3': return stepDownLevel(2)
    case 'h4': return stepDownLevel(3)
    case 'p': return stepDownLevel(3)
    default: return ''
  }
}

// on created
Template.DynaText.onCreated(() => {
  const instance = Template.instance();
  instance.screenSize = new ReactiveVar('SMALL')
})

// helpers
Template.DynaText.helpers({
  html() {
    const instance = Template.instance()
    const tag = instance.data.tag?instance.data.tag:'p'
    const style = tagSwitch(tag)
    const classs = instance.data.class?instance.data.class:''
    const text = instance.data.text?instance.data.text:''
    return `<${tag} class="${classs}" style="${style}">${text}</${tag}>`
  }
})
