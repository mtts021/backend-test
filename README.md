# API de Gerenciamento de envestimento

**Descrição**: [Back End Test Project [clique aqui]](./CHALLENGE.md)

## Tecnologias

Node.js<br>
Fastify<br>
Mongoose<br>
Zod<br>
Swagger<br>
Vitest<br>
Docker e Docker Compose<br>

## Rodando o projeto

Para executar o projeto vai precisar ter o **docker e o docker compose** instalados na na sua máquina

### Clone o projeto em sua máquina e entre no diretório

```bash
git clone https://github.com/mtts021/backend-test.git

cd backend-test

git checkout development
```

### suba os containers

```bash
docker compose up -d
```

### Entre no container do Node.js com o comando

```bash
docker compose exec app bash
```

### Rode os testes

```bash
pnpm test
pnpm test:integration
```

### Rode a aplicação

```bash
pnpm start
```

## Documentação

- A API é documentada utilizando o swagger, e com o projeto rodando, será possível verificá-lo em <http://localhost:3000/docs/>
