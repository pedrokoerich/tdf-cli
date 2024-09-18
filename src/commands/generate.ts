import { GluegunToolbox } from "gluegun"

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, print, generateComponent } = toolbox
    const componentName = parameters.first

    if (!componentName) {
      print.error('Você precisa fornecer um nome para o componente!')
      return
    }

    await generateComponent(componentName)
  }
}
