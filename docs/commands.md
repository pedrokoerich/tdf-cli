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