/**
 * express demonstration start
 */
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express and TypeScript!!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

/**
 * express demonstration end
 */

/**
 * apollo gateway demonstration start
 */

import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";
import { readFileSync } from "fs";

const supergraphSdl = readFileSync('./supergraph.graphql').toString();

const gateway = new ApolloGateway({
  supergraphSdl,
});
const server = new ApolloServer({
  gateway,
});

server.listen({ port: process.env.PORT_GATEWAY }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
}).catch(e => {
  console.error(e);
});
/**
 * apollo gateway demonstration end
 */