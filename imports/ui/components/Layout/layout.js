import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Log } from 'meteor/mozfet:meteor-logs'
import './layout.html'

// set autoform template
AutoForm.setDefaultTemplate('materialize')

// reactive dict with layout as key and template as value
const layoutTemplates = new ReactiveDict()

export const set = (layout, template) => {
  layoutTemplates.set(layout, template)
}

export const get = (layout) => {
  layoutTemplates.get(layout)
}

export default { set, get }

Template.Layout.onCreated(() => {
  const instance = Template.instance()
  Log.log(['debug', 'layout'], `Layout instance data:`, instance.data)
})

Template.Layout.helpers({
  template() {
    const instance = Template.instance()
    return layoutTemplates.get(instance.data.name)
  }
})
