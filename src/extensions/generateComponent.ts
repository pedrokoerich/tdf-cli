import { GluegunToolbox } from 'gluegun';
import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite'; // Para codificação Windows-1252

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.generateComponent = async (componentType: string, componentName: string) => {
    try {
      const validTypes = ['service', 'controller', 'data', 'utils', 'mvc', 's', 'c', 'd', 'u', 'm'];
      if (!validTypes.includes(componentType)) {
        toolbox.print.error(`Tipo de componente inválido. Tipos válidos: ${validTypes.join(', ')}`);
        return;
      }

      // Mapear os tipos abreviados para completos
      const typeMap = { s: 'service', c: 'controller', d: 'data', u: 'utils', m: 'mvc' };
      componentType = typeMap[componentType] || componentType;

      const projectRoot = findProjectRoot('project-info.json');
      if (!projectRoot) {
        toolbox.print.error('Arquivo project-info.json não encontrado.');
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
        toolbox.print.error('Descrição do componente não fornecida.');
        return;
      }

      const baseDir = process.cwd();
      const templateFile = `${namespace}.${componentName}.${componentType}.tlpp`;

      // Caminho da pasta de templates
      const templateDir = findProjectRoot('bin');
      const templateFilePath = path.join(templateDir, 'src', 'templates', 'context', `${componentType}.tlpp`);
      const destFilePath = path.join(baseDir, templateFile);

      toolbox.print.info(`Template source: ${templateFilePath}`);
      toolbox.print.info(`Destination path: ${destFilePath}`);

      const replaceDynamicContent = (content: string) => {
        const capitalizedComponent = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        const lowerComponent = componentName.toLowerCase();

        return content
          .replace(/{{namespace}}/g, namespace)
          .replace(/namespaceEndpoint/g, namespaceEndpoint)
          .replace(/nomedocomponente/g, lowerComponent)
          .replace(/Nomedocomponente/g, capitalizedComponent)
          .replace(/Descrição do componente informada no momento da geração/g, description)
          .replace(/Ã©/g, 'é')
          .replace(/Ã§/g, 'ç');
      };

      const copyTemplateFile = (src: string, dest: string) => {
        if (!fs.existsSync(src)) {
          toolbox.print.error(`Template ${src} não encontrado.`);
          return;
        }

        let content = iconv.decode(fs.readFileSync(src), 'windows-1252');
        content = replaceDynamicContent(content);
        const encodedContent = iconv.encode(content, 'windows-1252');
        fs.writeFileSync(dest, encodedContent);
      };

      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }

      copyTemplateFile(templateFilePath, destFilePath);
      toolbox.print.success(`Componente ${componentName} (${componentType}) criado com sucesso!`);
    } catch (error) {
      toolbox.print.error(`Erro ao criar o componente: ${error.message}`);
    }
  };

  // Função auxiliar para encontrar o diretório raiz do projeto
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
