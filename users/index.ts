import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";
import typeDefs from "./delivery/graphql/schema";
import resolvers from "./delivery/graphql/";

dotenv.config();

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
  })
});

server.listen(process.env.PORT || 8002).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});