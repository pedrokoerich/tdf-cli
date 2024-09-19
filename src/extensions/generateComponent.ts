import { GluegunToolbox } from 'gluegun';
import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite'; // Para codificação Windows-1252

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.generateComponent = async (componentType: string, componentName: string) => {
    try {
      // Definir tipos válidos de componentes
      const validTypes = ['service', 'controller', 'data', 'utils', 'mvc','s', 'c', 'd', 'u', 'm'];
      if (!validTypes.includes(componentType)) {
        toolbox.print.error(`Tipo de componente inválido. Tipos válidos: ${validTypes.join(', ')}`);
        return;
      }

      switch (componentType) {
        case 's':
          componentType = 'service';
          break;
        case 'c':
          componentType = 'controller';
          break;
        case 'd':
          componentType = 'data';
          break;
        case 'u':
          componentType = 'utils';
          break;
        case 'm':
          componentType = 'mvc';
          break;
      }

      // Ler o namespace do project-info.json
      const findProjectRoot = (param) => {
        let currentDir = process.cwd();
        while (!fs.existsSync(path.join(currentDir, param))) {
          const parentDir = path.resolve(currentDir, '..');
          if (currentDir === parentDir) {
            // Chegou na raiz do sistema de arquivos sem encontrar o arquivo
            return null;
          }
          currentDir = parentDir;
        }
        return currentDir;
      };
      
      let projectRoot = findProjectRoot('project-info.json');
      if (!projectRoot) {
        toolbox.print.error('Arquivo project-info.json não encontrado.');
        return;
      }
      
      const projectInfoPath = path.join(projectRoot, 'project-info.json');

      if (!fs.existsSync(projectInfoPath)) {
        toolbox.print.error('Arquivo project-info.json não encontrado.');
        return;
      }

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

      toolbox.print.info(`Descrição fornecida: ${description}`);

      // Definir o caminho base para o componente
      // Definir o caminho base para o componente no diretório atual
      const baseDir = process.cwd();


      // Definir o template e o arquivo de destino
      const templateFile = `${namespace}.${componentName}.${componentType}.tlpp`;
      let templateDir = findProjectRoot(`bin`);
      if (!templateDir) {
        toolbox.print.error(`Arquivo ${componentType}.tlpp não encontrado.`);
        return
      }
      const templateFilePath = path.join(templateDir, 'src','templates', 'context',`${componentType}.tlpp`);      
      const destFilePath = path.join(baseDir, templateFile);

      toolbox.print.info(`Template source: ${templateFilePath}`);
      toolbox.print.info(`Destination path: ${destFilePath}`);

      // Função para substituir conteúdo dinâmico
      const replaceDynamicContent = (content: string) => {
        const capitalizedComponent = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        const lowerComponent = componentName.toLowerCase();

        let updatedContent = content
          .replace(/{{namespace}}/g, namespace)
          .replace(/namespaceEndpoint/g, namespaceEndpoint)
          .replace(/nomedocomponente/g, lowerComponent)
          .replace(/Nomedocomponente/g, capitalizedComponent)
          .replace(/Descrição do componente informada no momento da geração/g, description)
          .replace(/Ã©/g, 'é')
          .replace(/Ã§/g, 'ç');

        return updatedContent;
      };

      // Função para copiar o arquivo do template
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

      // Criar diretório e copiar o arquivo
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }

      copyTemplateFile(templateFilePath, destFilePath);

      toolbox.print.success(`Componente ${componentName} (${componentType}) criado com sucesso!`);
    } catch (error) {
      toolbox.print.error(`Erro ao criar o componente: ${error.message}`);
    }
  };
};
