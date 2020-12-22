import { Template } from 'meteor/templating'
import './afArrayField.html'
import {Sortable} from '@shopify/draggable'
import {_} from 'meteor/underscore'

// repack the fields on the DOM
const repackFields = (instance, fields) => {
  // console.log('repackFields: fields', fields)

  // stamp every field
  for (let field of fields) {
    // console.log('repackFields: stamping: field old name', field.oldName)

    // find all inputs with name starting with field name
    const inputs = instance.$(`[name^="${field.oldName}"]`).get()
    // console.log(`repackFields: stamping: found ${inputs.length} inputs`)

    // for each input
    for (let input of inputs) {

      // get input query
      const qInput = instance.$(input)

      // get name of input
      const name = qInput.attr('name')
      // console.log('repackFields: stamping: adding old name', name)

      // add old name attribute to each input
      qInput.attr('old-name', name)

      // get the id of input
      const id = qInput.attr('id')
      // console.log('repackFields: stamping: adding old id', id)

      // add old name attribute to each input
      qInput.attr('old-id', id)
    }
  }

  // repack every field
  for (let field of fields) {
    // console.log('repackFields: repack: field', field.oldName)

    // find all inputs starting with old field name
    const fieldElements = instance.$(`[old-name^="${field.oldName}"]`).get()
    // console.log(`repackFields: repack: found ${fieldElements.length} inputs`)
    // const fieldElementNamesString = _.chain(fieldElements)
    //     .map(fieldElement => {
    //       return instance.$(fieldElement).attr('name')
    //     })
    //     .reduce((memo, fieldElementName) => {
    //       return memo+', '+fieldElementName
    //     })
    //     .value()
    // console.log(`repackFields: repack: field elements: ${fieldElementNamesString}.`)

    // for each input
    for (let fieldElement of fieldElements) {

      // get input query
      const qFieldElement = instance.$(fieldElement)
      // console.log('repackFields: repack: value', qFieldElement.val())

      // get old name of input
      const oldName = qFieldElement.attr('old-name')
      // console.log('repackFields: repack: old name', oldName)

      // get old id of input
      const oldId = qFieldElement.attr('old-id')
      // console.log('repackFields: repack: old id', oldId)

      // create new name
      const newName = field.newName+oldName.substring(field.newName.length)
      // console.log('repackFields: repack: new name', newName)

      // get input being replaced
      const replaced = instance.$(`[old-name="${newName}"]`)
      if(replaced.length === 0) {
        const err = `Cannot find query: [old-name="${newName}"]`
        console.error(err)
        throw 'err'
      }
      // console.log('repackFields: repack: replaced ', replaced)
      const newId = replaced.attr('old-id')
      // console.log('repackFields: repack: new id', newId)

      // check if data schema key exists
      const hasDataSchemaKey = qFieldElement.attr('data-schema-key')?true:false

      // update attributes
      qFieldElement.attr('name', newName)
      if (newId) {qFieldElement.attr('id', newId)}
      if (hasDataSchemaKey) {qFieldElement.attr('data-schema-key', newName)}
    }
  }

  // prune each field
  for (let field of fields) {
    // console.log('repackFields: pruning: field', field.oldName)

    // find all fields starting with field name
    const inputs = instance.$(`[old-name^="${field.oldName}"]`).get()
    // console.log(`repackFields: pruning: found ${inputs.length} inputs`)

    // for each input
    for (let input of inputs) {

      // get input query
      const qInput = instance.$(input)

      // update name and data-schema-key attributes with new name
      qInput.removeAttr('old-id')
      qInput.removeAttr('old-name')
    }
  }
}

const getArrayFromDom = (instance, fieldName) => {

  // find the first array
  const qArray = instance.$('.js-autoform-array').first()
  // console.log('getArrayFromDom: qArray', qArray)

  // find the items of the array
  const itemElements = qArray.children('.js-autoform-array-item').get()
  // console.log('getArrayFromDom: itemElements', itemElements)

  // for each item in items
  const array = _.map(itemElements, itemElement => {

    // get the properties of the item
    const oldName = instance.$(itemElement).find(`[name^="${fieldName}"]`)
        .first().attr('name')
    const newIndex = instance.$(itemElement).prevAll().length-1
    const splitOldName = oldName.split('.')
    const oldIndex = Number(_.last(splitOldName))
    const arrayFieldName = _.first(splitOldName)
    const newName = arrayFieldName+'.'+newIndex

    // return an object representing the item
    return {arrayFieldName, oldName, newName, oldIndex, newIndex}
  })
  // console.log('getArrayFromDom: array', array)

  // return the array
  return array
}

const moveFieldInArray = (instance, array, fromIndex, toIndex) => {

  // define new array to delete than add
  const repack = []

  // pack field being moved
  const fieldBeingMoved = _.clone(array[fromIndex])
  fieldBeingMoved.newIndex = toIndex
  repack.push(fieldBeingMoved)

  const fieldBeingReplaced = _.clone(array[toIndex])
  fieldBeingReplaced.newIndex = fromIndex>toIndex?toIndex+1:toIndex-1
  repack.push(fieldBeingReplaced)

  // for each field starting after toIndex
  const lowestIndex = fromIndex>toIndex?toIndex:fromIndex
  for (let i = lowestIndex+1; i < array.length; i++) {

    // if index is not fromIndex or toIndex
    if ((i !== fromIndex) && (i !== toIndex)) {

      // shift idex and pack item
      const shifted = _.clone(array[i])
      shifted.newIndex = shifted.index+1
      repack.push(shifted)
    }
  }

  // update repacked fields
  repackFields(instance, repack)
}

Template.afArrayField_materialize.onRendered(() => {

  const instance = Template.instance()
  console.log('afArrayField_materialize.data', instance.data)

  const context = AutoForm.Utility.getComponentContext(instance.data.atts,
      "afEachArrayItem")
  const fieldName = context.atts.name

  // setup drag and drop sorting
  const sortableContainerSelector = '.js-autoform-array'
  const sortableContainers = instance.$(sortableContainerSelector).get()
  // console.log('sortable containers', sortableContainers)

  const sortable = new Sortable(sortableContainers, {
    draggable: '.js-autoform-array-item',
    appendTo: 'body',
    mirror: {
      constrainDimensions: true,
    },
    delay: 250
  })

  // on sorted dag event
  let isSorted = false
  sortable.on('sortable:sorted', (dragEvent) => {
    isSorted = true
  })

  // on sorted dag event
  sortable.on('mirror:destroy', (dragEvent) => {
    // console.log('mirror:destroy:', dragEvent)

    // if the array was sorted
    if (isSorted) {

      // get the array tracker value
      const array = getArrayFromDom(instance, fieldName)

      // repack the fieds on the DOM
      repackFields(instance, array)
    }
  })
})
