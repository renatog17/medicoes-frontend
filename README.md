# Medições

Frontend React integrado aos endpoints da coleção Postman do projeto.

## Executar

Inicie o backend em http://localhost:8080 e execute `npm run dev` neste diretório. Caso necessário, instale as dependências com `npm install`.

O Vite encaminha `/api` ao backend durante o desenvolvimento. Para mudar a conexão, copie `.env.example` para `.env.local`, ajuste as variáveis e reinicie o Vite. `API_PROXY_TARGET` é a origem do backend; `VITE_API_BASE_URL` é o caminho completo público, incluindo `/api`. Variáveis VITE são públicas; não inclua segredos.

## Funcionalidades

- Clientes, imóveis e medidores: listagem paginada, consulta por ID, criação, edição e exclusão com confirmação.
- Instalações: listagem, consulta por ID, criação, encerramento e filtros por cliente, imóvel, medidor e situação.
- Faturas: listagem paginada, filtro por competência e consulta de detalhes por ID.
- Instalações: dia de emissão opcional de 1 a 31 (em branco, a API usa 1; meses curtos usam o último dia).
- Medições: cadastro e histórico na instalação, consulta por ID e indicação de falha na emissão da fatura, sem nova tentativa automática.
- Detalhes consultados novamente antes de visualizar, editar e encerrar.
- CPF validado, estados de carregamento, erro e lista vazia.
- Datas no horário local do navegador, enviadas em ISO-8601 UTC.

Instalações preservam o histórico e não possuem edição ou exclusão. Situação derivada de dataFim. Os IDs dos vínculos são informados no formulário e consultados nas telas dos cadastros. Registros vinculados a instalações não podem ser excluídos. CIN e número de série permanecem reservados após exclusão.

A coleção não fornece exemplos de resposta: as listas esperam `content`, `totalElements` e `totalPages`, também aceitando metadados em `page` ou arrays simples. Os formulários seguem os corpos documentados. A consulta de detalhes exibe todos os campos retornados, incluindo histórico.

## Organização do código

- `src/App.jsx`: conecta a rota atual ao layout e à página correspondente.
- `src/router.js` e `src/config/routes.js`: definem as páginas e seus caminhos.
- `src/pages/`: páginas de clientes, imóveis, medidores, instalações e faturas. `RecordsPage.jsx` compartilha a estrutura de listagem e os modais.
- `src/components/layout/`: menu lateral e estrutura visual da aplicação.
- `src/components/records/`: tabela, resumo, detalhes e formulário de cadastro/edição.
- `src/components/forms/` e `src/components/filters/`: campos de formulário, endereço e filtros de cada página.
- `src/components/measurements/`: histórico, formulário e tabela de medições.
- `src/components/ui/`: alertas, links, modal, paginação e estados de carregamento.
- `src/hooks/`: navegação, consulta paginada e ações dos registros.
- `src/services/`: cliente HTTP e chamadas aos endpoints. A URL-base fica em `services/api.js`.
- `src/config/`: configuração dos cadastros, rótulos e listas de estados/cidades.
- `src/utils/`: máscaras, montagem dos dados enviados, validação de CPF e regras de medições.

Rotas: `/clientes`, `/imoveis`, `/medidores`, `/instalacoes` e `/faturas`. A raiz direciona para clientes e caminhos desconhecidos exibem a página 404. A navegação usa o histórico do navegador; o Nginx já possui fallback para permitir atualizar ou abrir diretamente essas URLs.

Ao alterar uma tela, comece pelo arquivo correspondente em `src/pages/`. Os campos de cadastro ficam em `src/config/resources.js`; os endpoints ficam em `src/services/`.

## Validação e produção

`npm run build` gera dist. `npm run lint` verifica o código. `npm test` executa os testes de API, CPF, máscaras, envio de formulários, rotas e medições.

O proxy é exclusivo do desenvolvimento. Para produção, configure VITE_API_BASE_URL antes do build para a URL pública da API (com CORS no backend) ou configure um proxy `/api` no servidor de hospedagem. `npm run preview` não fornece o proxy. Uma página HTTPS exige uma API HTTPS quando a conexão é direta.

## Deploy local em Docker

Consulte [DEPLOY_LOCAL.md](DEPLOY_LOCAL.md) para construir e executar o frontend com Nginx na rede Docker do backend.
# medicoes-frontend
