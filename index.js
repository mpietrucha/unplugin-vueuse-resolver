const fs = require('fs')
const pkg = require('local-pkg')
const camelCase = require('lodash/camelCase')

let components = undefined

module.exports = function VueUseResolver(config = { prefix: 'vueUse' }) {
    return name => {
        const resolver = name.replace(config.prefix, '')

        if (resolver === name) {
            return
        }

        const allowedResolvers = [
            camelCase(resolver), `use${resolver}`
        ]

        if (! components) {
            const corePath = pkg.resolveModule('@vueuse/core') || process.cwd()

            const path = pkg.resolveModule('@vueuse/core/indexes.json')
                || pkg.resolveModule('@vueuse/metadata/index.json')
                || pkg.resolveModule('@vueuse/metadata/index.json', { paths: [corePath] })

            components = JSON.parse(fs.readFileSync(path, 'utf-8'))
        }

        const component = components.functions.find(module => {
            return allowedResolvers.includes(module.name)
        })

        return { name: component.name, from: `@vueuse/${component.package}` }
    }
}
