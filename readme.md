# TOTVS Developer Framework CLI (tdf-cli)

**TOTVS Developer Framework CLI (tdf-cli)** é uma ferramenta de linha de comando desenvolvida para agilizar a criação e a estruturação de projetos dentro do ecossistema TOTVS, facilitando a geração de contextos e componentes específicos para o desenvolvimento.

## Instalação

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

#### 2.1. Gerar um novo contexto

Se você selecionar a opção **Context** no menu, o CLI pedirá para fornecer o nome do contexto que deseja criar (por exemplo, **Ordem de Serviço**, **Pedido de Venda**, etc.).

**Exemplo de uso:**
```bash
tdf g
```
Escolha **Context** no menu e forneça o nome, como `OrdemServico`.

#### 2.2. Gerar um novo componente

Se você selecionar **Component** no menu, o CLI permitirá que você selecione, usando as setas do teclado, os componentes que deseja criar para um determinado contexto.

Os componentes disponíveis são:

- **controller**
- **service**
- **data**
- **utils**
- **mvc**

**Exemplo de uso:**
```bash
tdf g
```
Escolha **Component** no menu e, em seguida, selecione os componentes desejados como `controller`, `service`, etc.

## Exemplo Completo

1. Crie um novo projeto chamado `crm-system`:

   ```bash
   tdf new crm-system
   ```

2. Gere um novo contexto de **Pedido de Venda**:

   ```bash
   tdf g
   ```
   Selecione **Context** e insira o nome do contexto: `PedidoVenda`.

3. Gere componentes para o contexto de **Ordem de Serviço**:

   ```bash
   tdf g
   ```
   Selecione **Component** e escolha os componentes `controller`, `service` e `mvc`.

## Contribuição

Se você deseja contribuir para o projeto, sinta-se à vontade para abrir uma issue ou um pull request no repositório oficial.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
