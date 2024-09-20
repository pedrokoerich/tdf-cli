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
