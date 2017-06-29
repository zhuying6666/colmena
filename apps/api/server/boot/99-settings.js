'use strict'
const config = require('config')
const log = require('@colmena/logger')

module.exports = (app, cb) => {
  const nodeEnv = process.env.NODE_ENV || 'development'

  const configSettings = config.has('settings') ? config.get('settings') : {}

  const settings = Object.assign({}, configSettings, { nodeEnv })

  const systemSettings = Object.keys(settings).map(key => {
    const value = settings[key]

    return {
      key,
      value,
      system: true,
      public: true,
      type: typeof value,
    }
  })

  return app.models.SystemSetting
    .destroyAll({
      system: true,
    })
    .then(() => app.models.SystemSetting.create(systemSettings))
    .then(res =>
      res.forEach(item =>
        log.cyan.b(`[system-settings] Set ${item.key} = ${item.value}`)
      )
    )
    .asCallback(cb)
}
