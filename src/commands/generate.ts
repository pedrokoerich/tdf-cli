import { GluegunToolbox } from "gluegun";
const { prompt } = require('enquirer');

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const { print, generateContext, generateComponent } = toolbox;

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
      'Context: Será gerado um contexto dentro do seu projeto na pasta context',
      'Component: Será gerado um componente específico dentro da pasta context'
    ];

    const mainMenuChoice = await showMenu('Selecione o que deseja gerar:', mainMenuOptions);

    if (mainMenuChoice.startsWith('Context')) {
      // Opção Context selecionada
      const contextName = await prompt({
        type: 'input',
        name: 'contextName',
        message: 'Informe o nome do contexto (ex: Ordem de Serviço, Projetos, etc):'
      });

      if (!contextName.contextName) {
        console.log('Nome do contexto inválido.');
        process.exit();
      }

      // Gerar o contexto
      await generateContext(contextName.contextName);
      print.success(`Contexto ${contextName.contextName} gerado com sucesso!`);
    } else if (mainMenuChoice.startsWith('Component')) {
      // Opção Component selecionada
      const componentMenuOptions = ['Controller', 'Service', 'Data', 'Utils', 'MVC'];

      const componentMenuChoice = await showMenu('Selecione o componente que deseja gerar:', componentMenuOptions);
      const componentType = componentMenuChoice.toLowerCase();

      const contextName = await prompt({
        type: 'input',
        name: 'contextName',
        message: 'Informe o nome do contexto onde o componente será gerado:'
      });

      if (!contextName.contextName) {
        console.log('Nome do contexto inválido.');
        process.exit();
      }

      // Gerar o componente
      await generateComponent(componentType, contextName.contextName);
      print.success(`Componente ${componentType} gerado com sucesso no contexto ${contextName.contextName}!`);
    }

    process.exit();
  },
};
