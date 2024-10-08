import { GluegunToolbox } from 'gluegun'
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const chalk = require('chalk');
const AdmZip = require('adm-zip');


module.exports = (toolbox: GluegunToolbox) => {
  toolbox.newProject = async (projectName: string) => {
    const baseDir = path.join(process.cwd(), projectName)
    const srcDir = path.join(baseDir, 'src')
    const templateDir = path.join(__dirname, '..', 'templates') // Caminho para a pasta de templates

    // Perguntar o namespace ao usuário
    const namespace = await toolbox.prompt.ask({
      type: 'input',
      name: 'namespace',
      message: 'Informe o Namespace do seu projeto:'
    })

    // Criar o arquivo project-info.json com o namespace
    const projectInfo = {
      namespace: namespace.namespace
    }

    // Verificar se a pasta base existe, se não, cria ela
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true })
    }

    fs.writeFileSync(
      path.join(baseDir, 'project-info.json'),
      JSON.stringify(projectInfo, null, 2),
      'utf-8'
    )

    // Função para copiar e substituir arquivos de template
    const copyTemplateFile = (templateFilePath: string, destFilePath: string, replacements: { [key: string]: string }, encoding: string = 'utf-8') => {
      // Se for Windows-1252, lê com essa codificação
      let content;
      if (encoding === 'windows-1252') {
        content = iconv.decode(fs.readFileSync(templateFilePath), 'windows-1252');
      } else {
        content = fs.readFileSync(templateFilePath, 'utf-8'); // Lê em UTF-8 por padrão
      }

      // Substituições dinâmicas no conteúdo
      Object.keys(replacements).forEach(key => {
        content = content.replace(new RegExp(`${key}`, 'g'), replacements[key]);
      });

      // Se for Windows-1252, codifica e salva o arquivo com essa codificação
      if (encoding === 'windows-1252') {
        const encodedContent = iconv.encode(content, 'windows-1252');
        fs.writeFileSync(destFilePath, encodedContent); // Salva com Windows-1252
      } else {
        fs.writeFileSync(destFilePath, content, 'utf-8'); // Salva com UTF-8
      }

      // Exibe o caminho e tamanho do arquivo criado com "CREATE" e cor verde
      const stats = fs.statSync(destFilePath);
      console.log(chalk.green(`CREATE `) + `${destFilePath} (${(stats.size / 1024).toFixed(2)} KB)`);
    };

    // Substituições dinâmicas para os templates
    const replacements = {
      projectName,
      namespace: namespace.namespace,
      currentDate: new Date().toLocaleDateString('pt-BR')
    }

    // Criar estrutura de pastas dentro de src
    const directoriesToCreate = [
      'src/context',
      'src/lib',
      'src/schedules',
      'src/workflows',
      'src/entry points',
      'src/querys',
      'packages/includes',
      'packages/rdmakes'
    ]

    directoriesToCreate.forEach(dir => {
      const dirPath = path.join(baseDir, dir)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      console.log(chalk.green(`CREATE `)+ dirPath); // Usando "CREATE" e cor verde
    })

    // Copiar e substituir conteúdo do readme.md
    const readmeTemplatePath = path.join(templateDir, 'readme.md')
    const readmeDestPath = path.join(baseDir, 'readme.md')
    copyTemplateFile(readmeTemplatePath, readmeDestPath, replacements, 'utf-8');

    // Copiar e substituir conteúdo do .gitignore
    const gitignoreTemplatePath = path.join(templateDir, '.gitignore.template')
    const gitognoreDestPath = path.join(baseDir, '.gitignore')
    copyTemplateFile(gitignoreTemplatePath, gitognoreDestPath, replacements, 'utf-8');

    // Copiar e substituir conteúdo do Jenkinsfile
    const jenkinsTemplatePath = path.join(templateDir, 'Jenkinsfile')
    const jenkinsDestPath = path.join(baseDir, 'Jenkinsfile')
    copyTemplateFile(jenkinsTemplatePath, jenkinsDestPath, replacements, 'utf-8');

    // Copiar e substituir conteúdo do sigapci.tlpp
    const sigapciTemplatePath = path.join(templateDir, 'sigapci.tlpp')
    const sigapciDestPath = path.join(srcDir, 'sigapci.tlpp')
    copyTemplateFile(sigapciTemplatePath, sigapciDestPath, replacements, 'windows-1252');

    // Copiar e substituir conteúdo do sigapci.tlpp
    const libUtilsTemplatePath = path.join(templateDir, 'lib.utils.tlpp')
    const libUtilsDestPath = path.join(srcDir, 'lib', `${namespace.namespace}.lib.utils.tlpp`)
    copyTemplateFile(libUtilsTemplatePath, libUtilsDestPath, replacements, 'windows-1252');

    function extractZip(zipPath: string, extractTo: string) {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractTo, true); // extrai para a pasta especificada

      const stats = fs.statSync(extractTo);
      console.log(chalk.green(`CREATE `) + `${extractTo} (${(stats.size / 1024).toFixed(2)} KB)`);
    }

    // Extrair o arquivo de templates.zip
    const destinoZipPath = path.join(baseDir, 'packages', 'includes')
    const templatesZipPath = path.join(templateDir,'includes.zip');
    extractZip(templatesZipPath, destinoZipPath);

    // Mensagem final de sucesso com o check verde
    console.log(chalk.green.bold(`✔' Projeto ${projectName} gerado com sucesso na pasta ${baseDir}`));
  }
}
