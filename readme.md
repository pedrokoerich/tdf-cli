
# TOTVS Developer Framework CLI (tdf-cli)

**TOTVS Developer Framework CLI (tdf-cli)** é uma ferramenta de linha de comando desenvolvida para agilizar a criação e a estruturação de projetos dentro do ecossistema TOTVS, facilitando a geração de contextos e componentes específicos para o desenvolvimento.

## Instalação

### Pré-requisitos
Instale o [Node.js](https://nodejs.org) que inclui o [Node Package Manager](https://docs.npmjs.com/getting-started)

Para instalar o `tdf-cli`, execute o seguinte comando:

```bash
npm install -g tdf-cli
```

Este comando instala o CLI globalmente em seu sistema, permitindo que você execute os comandos de qualquer diretório.

## Comandos Disponíveis

A seguir estão os comandos disponíveis para serem executados com o `tdf-cli`.

### 1. Criar um novo projeto

```bash
tdf new <nome-do-projeto>
```

Este comando cria um novo projeto com o nome fornecido. Ele define a estrutura básica do projeto com todos os arquivos e pastas necessários.

**Exemplo de uso:**
```bash
tdf new my-awesome-project
```

### 2. Gerar um novo contexto ou componente

O comando `tdf generate` ou sua versão abreviada `tdf g` permite gerar contextos ou componentes dentro do projeto. Após a execução deste comando, o terminal abrirá um menu interativo para escolher entre **Context** ou **Component**.

```bash
tdf generate
```
ou
```bash
tdf g
```

Ao executar o comando, o seguinte menu interativo será exibido:

```bash
? O que você deseja gerar? (Use as setas para navegar e Enter para selecionar)

❯ Context
  Component
```

#### 2.1. Gerar um novo contexto

Se você selecionar a opção **Context** no menu, o CLI pedirá para fornecer o nome do contexto que deseja criar (por exemplo, **Ordem de Serviço**, **Pedido de Venda**, etc.).

**Exemplo de uso:**
```bash
tdf g
```
Escolha **Context** no menu e forneça o nome, como `OrdemServico`.

Dentro da pasta `OrdemServico` será gerado 5 pastas e com seus arquivos respectivos já pré-preenchidos.

Exemplo de estrutura:

```
- OrdemServico
   |- Controller
      |- namespace.OrdemServico.controller.tlpp
   |- Service
      |- namespace.OrdemServico.service.tlpp
   |- Data
      |- namespace.OrdemServico.data.tlpp
   |- Utils
      |- namespace.OrdemServico.utils.tlpp
   |- Mvc
      |- OrdemServico.mvc.tlpp
```

#### 2.2. Gerar um novo componente

Se você selecionar **Component** no menu, o CLI permitirá que você selecione, usando as setas do teclado, os componentes que deseja criar para um determinado contexto.

O menu de seleção será assim:

```bash
? Selecione os componentes que deseja gerar (use as setas e barra de espaço para marcar):

❯ controller
  service
  data
  utils
  mvc
```

## Exemplo Completo

1. Crie um novo projeto chamado `crm-system`:

   ```bash
   tdf new crm-system
   ```

2. Informe o Namespace `custom.tdfcli`:

   ```bash
   √ Informe o Namespace do seu projeto: custom.tdfcli
   ```

3. Saída do Console:

   ```bash
   CREATE C:\pessoais\tdf-cli\crm-system\src\context
   CREATE C:\pessoais\tdf-cli\crm-system\src\lib
   CREATE C:\pessoais\tdf-cli\crm-system\src\schedules
   CREATE C:\pessoais\tdf-cli\crm-system\src\workflows
   CREATE C:\pessoais\tdf-cli\crm-system\packages\includes
   CREATE C:\pessoais\tdf-cli\crm-system\packages\rdmakes
   CREATE C:\pessoais\tdf-cli\crm-system\readme.md (0.82 KB)
   CREATE C:\pessoais\tdf-cli\crm-system\.gitignore (0.02 KB)
   CREATE C:\pessoais\tdf-cli\crm-system\Jenkinsfile (2.49 KB)
   CREATE C:\pessoais\tdf-cli\crm-system\src\sigapci.tlpp (0.54 KB)
   CREATE C:\pessoais\tdf-cli\crm-system\packages\includes (0.00 KB)

   ✔ Projeto crm-system gerado com sucesso na pasta C:\pessoais\tdf-cli\crm-system
   ```

4. Gere um novo contexto de **Pedido de Venda**:

   ```bash
   cd crm-system
   tdf g
   ```
   
5. Selecione **Context** e insira o nome do contexto: `PedidoVenda`.
   ```bash
   ? O que você deseja gerar? (Use as setas para navegar e Enter para selecionar)

   ❯ Context
     Component
   ```

6. Selecione **Context** e insira o nome do contexto: `PedidoVenda` e uma descrição.
   ```bash
   √ Selecione o que deseja gerar: · Context[ Será gerado um contexto dentro do seu projeto na pasta context.]

   ? Informe o nome do contexto (ex: Faturamento, Financeiro, etc): » PedidoVenda

   ? Informe uma descrição para o contexto: »  API de Pedido de venda.
   ```

7. Saída do Console:

   ```bash
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\controller
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\controller\custom.tdfcli.PedidoVenda.controller.tlpp (1.47 KB)
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\service
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\service\custom.tdfcli.PedidoVenda.service.tlpp (1.82 KB)
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\data
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\data\custom.tdfcli.PedidoVenda.data.tlpp (2.75 KB)
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\utils
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\utils\custom.tdfcli.PedidoVenda.utils.tlpp (0.23 KB)
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\mvc
      CREATE C:\pessoais\tdf-cli\crm-system\src\context\PedidoVenda\mvc\PedidoVenda.mvc.tlpp (2.92 KB)

   ✔ Contexto PedidoVenda criado com sucesso!
   ```

## Contribuição

Se você deseja contribuir para o projeto, sinta-se à vontade para abrir uma issue ou um pull request no repositório oficial.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
