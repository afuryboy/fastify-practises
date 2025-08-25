

# first step

project init

```
fastify generate fastify-prisma --lang=ts
```
# second step

install dependencies
```
pnpm add prisma @prisma/client
```

# third step

prisma init (select mongodb  as db source)
```
npx prisma init --datasource-provider mongodb
```

The command will generate prisma/prisma.schema


you need to add model in prisma.schema

and then: generate prisma client

```
npx prisma generate
```

the prisma db push command updates your Prisma schema file to the database structure.
```
npx prisma db push
```