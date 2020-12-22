// imports
import i18n from 'meteor/universe:i18n'
Log.log(['debug', 'load'], `Loading module ${module.id}.`)

// prevent encoding special characters for html
i18n.setOptions({
  purify: string => string
})

// get the browser language
function getLang () {
  let lang = (
    navigator.languages && navigator.languages[0] ||
    navigator.language ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    'en-US'
  )
  lang = lang === 'en'?'en-US':lang
  lang = lang === 'en-uk'?'en-US':lang
  Log.log(['debug', 'locale'], `Language is ${lang}.`)
  return lang
}

const supportedLanguages = i18n.getLanguages('name')
Log.log(['debug', 'locale'], `Supported Languages: ${supportedLanguages}.`)

// set client locale
let lang = getLang()
i18n.setLocale(lang)

Log.log(['debug', 'locale'], `Translate ${i18n.__('MFS.title')}.`)
