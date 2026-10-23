# Medições

Frontend React integrado aos 19 endpoints da coleção Postman do projeto.

## Executar

Inicie o backend em http://localhost:8080 e execute `npm run dev` neste diretório. Caso necessário, instale as dependências com `npm install`.

O Vite encaminha `/api` ao backend durante o desenvolvimento. Para mudar a conexão, copie `.env.example` para `.env.local`, ajuste as variáveis e reinicie o Vite. `API_PROXY_TARGET` é a origem do backend; `VITE_API_BASE_URL` é o caminho completo público, incluindo `/api`. Variáveis VITE são públicas; não inclua segredos.

## Funcionalidades

- Clientes, imóveis e medidores: listagem paginada, consulta por ID, criação, edição e exclusão com confirmação.
- Instalações: listagem, consulta por ID, criação, encerramento e filtros por cliente, imóvel, medidor e situação.
- Detalhes consultados novamente antes de visualizar, editar e encerrar.
- CPF validado, estados de carregamento, erro e lista vazia.
- Datas no horário local do navegador, enviadas em ISO-8601 UTC.

Instalações preservam o histórico e não possuem edição ou exclusão. Situação derivada de dataFim. Os IDs dos vínculos são informados no formulário e consultados nas telas dos cadastros. Registros vinculados a instalações não podem ser excluídos. CIN e número de série permanecem reservados após exclusão.

A coleção não fornece exemplos de resposta: as listas esperam `content`, `totalElements` e `totalPages`, também aceitando metadados em `page` ou arrays simples. Os formulários seguem os corpos documentados. A consulta de detalhes exibe todos os campos retornados, incluindo histórico.

## Validação e produção

`npm run build` gera dist. `npm run lint` verifica o código.

O proxy é exclusivo do desenvolvimento. Para produção, configure VITE_API_BASE_URL antes do build para a URL pública da API (com CORS no backend) ou configure um proxy `/api` no servidor de hospedagem. `npm run preview` não fornece o proxy. Uma página HTTPS exige uma API HTTPS quando a conexão é direta.

## Deploy local em Docker

Consulte [DEPLOY_LOCAL.md](DEPLOY_LOCAL.md) para construir e executar o frontend com Nginx na rede Docker do backend.
# medicoes-frontend
