import { GluegunToolbox } from 'gluegun';
import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite'; // Para codificação Windows-1252

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.generateComponent = async (componentName: string) => {
    try {
      // Ler o namespace do project-info.json
      const projectInfoPath = path.join(process.cwd(), 'project-info.json');

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
      const baseDir = path.join(process.cwd(), 'src', 'context', componentName);

      // Definir as pastas e arquivos que serão criados
      const folders = ['controller', 'service', 'data', 'utils', 'mvc'];
      const templateFiles = {
        controller: `${namespace}.${componentName}.controller.tlpp`,
        service: `${namespace}.${componentName}.service.tlpp`,
        data: `${namespace}.${componentName}.data.tlpp`,
        utils: `${namespace}.${componentName}.utils.tlpp`,
        mvc: `${componentName}.mvc.tlpp`,
      };

      console.log('namespaceEndpoint', namespaceEndpoint);

      // Ajustar o caminho dos templates para voltar uma pasta
      const templateDir = path.join(process.cwd(), '..', 'src', 'templates', 'context');
      toolbox.print.info(`Buscando templates no caminho: ${templateDir}`);

      // Definir mapeamento dinâmico de métodos e classes
      const replacementsMap = {
        controller: {
          class: 'NomedocomponenteController',
          methods: ['get', 'post', 'put', 'delete'],
        },
        service: {
          class: 'NomedocomponenteService',
          methods: ['get', 'post', 'put', 'delete'],
        },
        data: {
          class: 'NomedocomponenteData',
          methods: ['get', 'post', 'put', 'delete'],
        },
        utils: {
          class: 'NomedocomponenteUtils',
          methods: [],
        }
      };

      // Função para substituir conteúdo dinâmico nos arquivos
      const replaceDynamicContent = (content: string, folderType: string) => {
        const capitalizedComponent = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        const lowerComponent = componentName.toLowerCase();
        const replacement = replacementsMap[folderType];
      
        let updatedContent = content
          .replace(/{{namespace}}/g, namespace) // Substitui o namespace normal
          .replace(/namespaceEndpoint/g, namespaceEndpoint) // Substitui 'namespaceEndpoint' pelo valor com barras
          .replace(/nomedocomponente/g, lowerComponent) // Nome do componente em minúsculas
          .replace(/Nomedocomponente/g, capitalizedComponent) // Nome do componente com a primeira letra maiúscula
          .replace(/Descrição do componente informada no momento da geração/g, description) // Substitui a descrição
          .replace(/Ã©/g, 'é') // Corrige acentos
          .replace(/Ã§/g, 'ç'); // Corrige acentos
        
        // Substituir o nome da classe, se aplicável
        if (replacement?.class) {
          updatedContent = updatedContent.replace(replacement.class, `${capitalizedComponent}${folderType.charAt(0).toUpperCase() + folderType.slice(1)}`);
        }
      
        // Substituir os métodos GET, POST, PUT, DELETE, se aplicável
        replacement?.methods.forEach(method => {
          const methodPattern = new RegExp(`${method}Nomedocomponente`, 'g');
          updatedContent = updatedContent.replace(methodPattern, `${method}${capitalizedComponent}`);
        });
      
        return updatedContent;
      };
      
      // Função para copiar os arquivos do template
      const copyTemplateFile = (src: string, dest: string, folderType: string) => {
        if (!fs.existsSync(src)) {
          toolbox.print.error(`Template ${src} não encontrado.`);
          return;
        }
      
        // Ler o conteúdo do arquivo com a codificação Windows-1252
        let content = iconv.decode(fs.readFileSync(src), 'windows-1252');
        content = replaceDynamicContent(content, folderType);
      
        // Escrever o arquivo com codificação Windows-1252
        const encodedContent = iconv.encode(content, 'windows-1252');
        fs.writeFileSync(dest, encodedContent);
      };


      // Criar pastas e arquivos
      folders.forEach((folder) => {
        const folderPath = path.join(baseDir, folder);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        const templateFilePath = path.join(templateDir, `${folder}.tlpp`);
        const destFilePath = path.join(folderPath, templateFiles[folder]);

        toolbox.print.info(`Template source: ${templateFilePath}`);
        toolbox.print.info(`Destination path: ${destFilePath}`);

        // Copiar arquivo do template para o destino
        copyTemplateFile(templateFilePath, destFilePath, folder);
      });

      toolbox.print.success(`Componente ${componentName} criado com sucesso!`);
    } catch (error) {
      toolbox.print.error(`Erro ao criar o componente: ${error.message}`);
    }
  };
};