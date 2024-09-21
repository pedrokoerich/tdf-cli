import { GluegunToolbox } from 'gluegun';
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const chalk = require('chalk');

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.generateComponent = async (componentType: string, componentName: string) => {
    try {
      const validTypes = ['service', 'controller', 'data', 'utils', 'mvc', 's', 'c', 'd', 'u', 'm'];
      if (!validTypes.includes(componentType)) {
        console.error(chalk.red(`Tipo de componente inválido. Tipos válidos: ${validTypes.join(', ')}`));
        return;
      }

      // Mapear os tipos abreviados para completos
      const typeMap = { s: 'service', c: 'controller', d: 'data', u: 'utils', m: 'mvc' };
      componentType = typeMap[componentType] || componentType;

      const projectRoot = findProjectRoot('project-info.json');
      if (!projectRoot) {
        console.error(chalk.red('Arquivo project-info.json não encontrado.'));
        return;
      }

      const projectInfoPath = path.join(projectRoot, 'project-info.json');
      const projectInfo = JSON.parse(fs.readFileSync(projectInfoPath, 'utf-8'));
      const namespace = projectInfo.namespace;
      const namespaceEndpoint = namespace.replace(/\./g, '/');

      // Perguntar ao usuário pela descrição do componente
      const { description } = await toolbox.prompt.ask({
        type: 'input',
        name: 'description',
        message: 'Informe uma descrição para o componente:',
      });

      if (!description) {
        console.error(chalk.red('Descrição do componente não fornecida.'));
        return;
      }

      const baseDir = process.cwd();
      const templateFile = `${namespace}.${componentName}.${componentType}.tlpp`;

      // Caminho da pasta de templates
      const templateDir = findProjectRoot('bin');
      const templateFilePath = path.join(templateDir, 'src', 'templates', 'context', `${componentType}.tlpp`);
      const destFilePath = path.join(baseDir, 'src','context',templateFile);

      const replaceDynamicContent = (content: string) => {
        const capitalizedComponent = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        const lowerComponent = componentName.toLowerCase();

        return content
          .replace(/{{namespace}}/g, namespace)
          .replace(/namespaceEndpoint/g, namespaceEndpoint)
          .replace(/nomedocomponente/g, lowerComponent)
          .replace(/Nomedocomponente/g, capitalizedComponent)
          .replace(/Descrição do componente informada no momento da geração/g, description);
      };

      const copyTemplateFile = (src: string, dest: string) => {
        if (!fs.existsSync(src)) {
          console.error(chalk.red(`Template ${src} não encontrado.`));
          return;
        }

        let content = iconv.decode(fs.readFileSync(src), 'windows-1252');
        content = replaceDynamicContent(content);
        const encodedContent = iconv.encode(content, 'windows-1252');
        fs.writeFileSync(dest, encodedContent);

        // Obter o tamanho do arquivo
        const fileSize = fs.statSync(dest).size;
        console.log(chalk.green(`CREATE `) + `${dest} (${(fileSize / 1024).toFixed(2)} KB)`);
      };

      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }

      copyTemplateFile(templateFilePath, destFilePath);
      console.log(chalk.green.bold(`✔ Componente ${componentName} (${componentType}) criado com sucesso!`));
    } catch (error) {
      console.error(chalk.red(`Erro ao criar o componente: ${error.message}`));
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
