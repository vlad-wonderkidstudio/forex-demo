# Simple currensy scrapper
Made on pure NodeJs with TypeORM

# Installation

1) Rename `.env.sample` into `.env` file
2) Launch docker `docker compose up`
2) Wait for the docker is up and then `npm install`
3) Run migrations
`npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts`
4) Launch service:

On Windows:
`npm run dev-win`

On Unix-based systems:
`npm run dev`

# Note:
You can see PgAdmin here:
http://localhost:5050/browser/
