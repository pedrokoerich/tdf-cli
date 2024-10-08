import { GluegunToolbox } from "gluegun";
const { prompt } = require('enquirer');

export default {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const { generateContext, generateComponent } = toolbox;

    // Função para mostrar as opções e capturar a escolha do usuário com Enquirer
    const showMenu = async (message: string, choices: string[]): Promise<string> => {
      const response = await prompt({
        type: 'select',
        name: 'option',
        message,
        choices,
      });
      return response.option;
    };

    // Menu principal: escolha entre Context ou Component
    const mainMenuOptions = [
      'Context   [ Será gerado um contexto dentro do seu projeto na pasta context.]',
      'Component [ Será gerado um componente específico dentro da pasta context.  ]'
    ];

    const mainMenuChoice = await showMenu('Selecione o que deseja gerar:', mainMenuOptions);

    if (mainMenuChoice.startsWith('Context')) {
      // Opção Context selecionada
      const contextName = await prompt({
        type: 'input',
        name: 'contextName',
        message: 'Informe o nome do contexto (ex: Faturamento, Financeiro, etc):'
      });

      if (!contextName.contextName) {
        console.log('Nome do contexto inválido.');
        process.exit();
      }

      // Gerar o contexto
      await generateContext(contextName.contextName);
    } else if (mainMenuChoice.startsWith('Component')) {
      // Opção Component selecionada
      const componentMenuOptions = ['Controller', 'Service', 'Data', 'Utils', 'MVC'];

      const componentMenuChoice = await showMenu('Selecione o componente que deseja gerar:', componentMenuOptions);
      const componentType = componentMenuChoice.toLowerCase();

      const componentName = await prompt({
        type: 'input',
        name: 'componentName',
        message: 'Informe o nome do componente:'
      });

      if (!componentName.componentName) {
        console.log('Nome do componente inválido.');
        process.exit();
      }

      // Gerar o componente
      await generateComponent(componentType, componentName.componentName);
    }

    process.exit();
  },
};
