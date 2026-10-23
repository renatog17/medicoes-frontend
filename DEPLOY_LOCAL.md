# Deploy local com Docker (Ubuntu / WSL 2)

O frontend usa um build estático React servido por Nginx. O navegador acessa http://localhost:3000 e chama /api/* nessa mesma origem. O Nginx encaminha para http://api:8080/api/* pela rede externa medicoes-dev, preservando caminhos, parâmetros, métodos e corpos. Não é necessário habilitar CORS no backend para esse fluxo.

Este Compose gerencia somente o frontend. API e PostgreSQL continuam conforme ARQUITETURA_DOCKER_FRONTEND.md. O frontend não recebe credenciais do banco.

## Pré-requisitos

Abra o Ubuntu com `wsl.exe -d Ubuntu` no PowerShell. Use o mesmo Docker Engine do backend. A rede medicoes-dev precisa existir, a API precisa estar conectada com nome/alias api, e o banco postgres-dev deve estar disponível. Inicie-os conforme o README do backend.

```sh
docker info
docker compose version
docker network inspect medicoes-dev
```

Não é necessário instalar Node ou Nginx no host.

## Construir e iniciar

Execute no Ubuntu:

```sh
cd /mnt/c/Users/renat/Front/medicoes
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

Abra **http://localhost:3000** no Windows. A publicação usa apenas 127.0.0.1, para acesso local.

O Dockerfile instala dependências com npm ci, compila usando Node 24 e copia somente dist para uma imagem Nginx. A URL /api é definida no build. Arquivos .env*, dependências locais e testes ficam fora do contexto de build.

## Verificar

```sh
docker compose exec frontend nginx -t
curl --fail http://localhost:3000/healthz
curl --fail 'http://localhost:3000/api/clientes?page=0&size=1'
docker compose logs --tail=100 frontend
```

O healthcheck verifica somente o servidor frontend; a consulta de clientes verifica também a integração com a API, sem alterar dados. API indisponível pode resultar em 502/504 enquanto o frontend permanece saudável. O Nginx resolve novamente o DNS para acompanhar recriações da API e pode iniciar mesmo sem ela.

## Atualizar e parar

Após alterações no código, reconstrua a imagem:

```sh
docker compose up -d --build frontend
```

Para outra porta:

```sh
FRONTEND_PORT=3001 docker compose up -d --build
```

Você também pode criar um .env neste diretório com FRONTEND_PORT=3001. Esse arquivo é ignorado pelo Git e pelo build. A variável altera somente a porta do host; o container continua na porta 80.

Para parar e remover o frontend:

```sh
docker compose down
```

A API, o PostgreSQL, seu volume e a rede externa são mantidos. Este deploy não monta o código para recarga automática; para desenvolvimento continue usando npm run dev.

## Diagnóstico

| Problema | Verificação |
| --- | --- |
| Rede externa não encontrada | Prepare medicoes-dev conforme a arquitetura do backend. |
| Frontend abre, dados falham | Consulte /api/clientes e os logs do frontend e da API. |
| Nome api não resolve | Confira a rede compartilhada e o alias api com docker network inspect medicoes-dev. |
| Porta 3000 ocupada | Use FRONTEND_PORT=3001. |
| Código antigo | Reconstrua a imagem. |
| Docker indisponível no PowerShell | Execute no Ubuntu/WSL, onde está o Engine. |

Referências: [redes no Compose](https://docs.docker.com/compose/how-tos/networking/) e [proxy HTTP do Nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass).
