import { GluegunToolbox } from 'gluegun';
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const chalk = require('chalk');

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.generateContext = async (contextName: string) => {
    try {
      const projectRoot = findProjectRoot('project-info.json');
      if (!projectRoot) {
        console.error(chalk.red('Nenhum projeto localizado para geração do contexto.'));
        return;
      }

      const projectInfoPath = path.join(projectRoot, 'project-info.json');
      const projectInfo = JSON.parse(fs.readFileSync(projectInfoPath, 'utf-8'));
      const namespace = projectInfo.namespace;
      const namespaceEndpoint = namespace.replace(/\./g, '/');

      // Perguntar ao usuário pela descrição do contexto
      const { description } = await toolbox.prompt.ask({
        type: 'input',
        name: 'description',
        message: 'Informe uma descrição para o contexto:',
      });

      if (!description) {
        console.error(chalk.red('Descrição do componente não fornecida.'));
        return;
      }

      const baseDir = path.join(process.cwd(), 'src', 'context', contextName);
      const folders = ['controller', 'service', 'data', 'utils', 'mvc'];

      //const projectRootTemplate = findProjectRoot(__dirname);
      const templateDir = path.join(__dirname, '..', 'templates');
      const templateFiles = {
        controller: `${namespace}.${contextName}.controller.tlpp`,
        service: `${namespace}.${contextName}.service.tlpp`,
        data: `${namespace}.${contextName}.data.tlpp`,
        utils: `${namespace}.${contextName}.utils.tlpp`,
        mvc: `${contextName}.mvc.tlpp`,
      };

      const replaceDynamicContent = (content: string, folderType: string) => {
        const capitalizedComponent = contextName.charAt(0).toUpperCase() + contextName.slice(1);
        const lowerComponent = contextName.toLowerCase();

        return content
          .replace(/namespace/g, namespace)
          .replace(/namespaceEndpoint/g, namespaceEndpoint)
          .replace(/nomedocomponente/g, lowerComponent)
          .replace(/Nomedocomponente/g, capitalizedComponent)
          .replace(/currentDate/g, new Date().toLocaleDateString('pt-BR'))
          .replace(/description_context/g, description);
      };

      const copyTemplateFile = (src: string, dest: string, folderType: string) => {
        if (!fs.existsSync(src)) {
          console.error(chalk.red(`Template ${src} não encontrado.`));
          return;
        }

        let content = iconv.decode(fs.readFileSync(src), 'windows-1252');
        content = replaceDynamicContent(content, folderType);
        const encodedContent = iconv.encode(content, 'windows-1252');
        fs.writeFileSync(dest, encodedContent);

        // Obter o tamanho do arquivo
        const fileSize = fs.statSync(dest).size;
        console.log(chalk.green(`CREATE `) + `${dest} (${(fileSize / 1024).toFixed(2)} KB)`);
      };

      folders.forEach((folder) => {
        const folderPath = path.join(baseDir, folder);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          console.log(chalk.green(`CREATE `) + folderPath);
        }

        const templateFilePath = path.join(templateDir, `${folder}.tlpp`);
        const destFilePath = path.join(folderPath, templateFiles[folder]);

        copyTemplateFile(templateFilePath, destFilePath, folder);
      });

      console.log(chalk.green.bold(`✔ Contexto ${contextName} criado com sucesso!`));
    } catch (error) {
      console.error(chalk.red(`Erro ao criar o contexto: ${error.message}`));
    }
  };

  const findProjectRoot = (fileName: string) => {
    let currentDir = process.cwd();
    while (!fs.existsSync(path.join(currentDir, fileName))) {
      const parentDir = path.resolve(currentDir, '..');
      if (currentDir === parentDir) return null;
      currentDir = parentDir;
    }
    return currentDir;
  };
};
