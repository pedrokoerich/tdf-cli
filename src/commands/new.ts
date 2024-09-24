import { GluegunToolbox } from "gluegun";

module.exports = {
  name: 'new',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, print, newProject } = toolbox;
    const projectName = parameters.first;

    if (!projectName) {
      print.error('Você precisa fornecer um nome para o projeto!');
      return;
    }

    // Chama a função para criar o projeto
    await newProject(projectName);
  }
};
