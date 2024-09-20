import { GluegunToolbox } from 'gluegun';
import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite'; // Para codificação Windows-1252

export default (toolbox: GluegunToolbox) => {
  toolbox.generateContext = async (componentName: string) => {
    try {
      const projectRoot = findProjectRoot('project-info.json');
      if (!projectRoot) {
        toolbox.print.error('Arquivo project-info.json não encontrado.');
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
        toolbox.print.error('Descrição do componente não fornecida.');
        return;
      }

      const baseDir = path.join(process.cwd(), 'src', 'context', componentName);
      const folders = ['controller', 'service', 'data', 'utils', 'mvc'];

      const projectRootTemplate = findProjectRoot('bin');
      const templateDir = path.join(projectRootTemplate, 'src', 'templates', 'context');
      const templateFiles = {
        controller: `${namespace}.${componentName}.controller.tlpp`,
        service: `${namespace}.${componentName}.service.tlpp`,
        data: `${namespace}.${componentName}.data.tlpp`,
        utils: `${namespace}.${componentName}.utils.tlpp`,
        mvc: `${componentName}.mvc.tlpp`,
      };

      const replaceDynamicContent = (content: string, folderType: string) => {
        const capitalizedComponent = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        const lowerComponent = componentName.toLowerCase();

        return content
          .replace(/{{namespace}}/g, namespace)
          .replace(/namespaceEndpoint/g, namespaceEndpoint)
          .replace(/nomedocomponente/g, lowerComponent)
          .replace(/Nomedocomponente/g, capitalizedComponent)
          .replace(/Descrição do componente informada no momento da geração/g, description);
      };

      const copyTemplateFile = (src: string, dest: string, folderType: string) => {
        if (!fs.existsSync(src)) {
          toolbox.print.error(`Template ${src} não encontrado.`);
          return;
        }

        let content = iconv.decode(fs.readFileSync(src), 'windows-1252');
        content = replaceDynamicContent(content, folderType);
        const encodedContent = iconv.encode(content, 'windows-1252');
        fs.writeFileSync(dest, encodedContent);

        // Obter o tamanho do arquivo
        const fileSize = fs.statSync(dest).size;
        toolbox.print.info(`CREATE ${dest} (${(fileSize / 1024).toFixed(2)} KB)`);
      };

      folders.forEach((folder) => {
        const folderPath = path.join(baseDir, folder);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          toolbox.print.info(`CREATE ${folderPath}`);
        }

        const templateFilePath = path.join(templateDir, `${folder}.tlpp`);
        const destFilePath = path.join(folderPath, templateFiles[folder]);

        copyTemplateFile(templateFilePath, destFilePath, folder);
      });

      toolbox.print.success(`Contexto ${componentName} criado com sucesso!`);
    } catch (error) {
      toolbox.print.error(`Erro ao criar o contexto: ${error.message}`);
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
