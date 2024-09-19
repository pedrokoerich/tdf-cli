import { GluegunToolbox } from "gluegun";

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, print, generateContext, generateComponent } = toolbox;

    const [componentType, componentName] = parameters.array || [];
    console.log(parameters.array);

    if (!componentType || !componentName) {
      print.error('Uso: generate [context/component] [tipo] [nome]');
      return;
    }

    const contextActions = ['context', 'c'];
    const componentActions = ['service', 'controller', 'data', 'utils', 'mvc', 's', 'c', 'd', 'u', 'm'];
    
    if (contextActions.includes(componentType)) {
      await generateContext(componentName);
    } else if (componentActions.includes(componentType)) {
      await generateComponent(componentType, componentName);
    } else {
      print.error('Ação inválida. Use "context" ou "component".');
    }
    
  },
};
