import { ApolloServer } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";
import typeDefs from "./delivery/graphql/schema";
import resolvers from "./delivery/graphql/";
import { authDirectiveTransformer } from "./delivery/graphql/directive/auth";

dotenv.config();

const server = new ApolloServer({
  schema: authDirectiveTransformer(buildSubgraphSchema({
    typeDefs,
    resolvers,
  })),
  context: ({ req }) => {
    const ctx: {
      token?: string;
      roles: string[];
      userId?: string;
    } = {
      token: req.headers.authorization,
      roles: req.headers["x-user-roles"] && (req.headers["x-user-roles"] as string)?.split(",") || [],
      userId: req.headers["x-user-id"] as string,
    }

    return ctx;
  }
});

server.listen(process.env.PORT || 8002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});