import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";
import typeDefs from "./delivery/graphql/schema";

dotenv.config();

// define User type
interface User {
  id: string;
  username?: string;
}

// static fetchUserById function
const fetchUserById = (id: string): User => {
  const user: User = {
    id,
    username: `John Doe ${id}`,
  };
  return user;
} 

const resolvers = {
  Query: {
    me() {
      return fetchUserById("1")
    },
    users(parent: any, args: any, context: any, info: any) {
      if (!args.ids) {
        return [fetchUserById("id-1"), fetchUserById("id-2"), fetchUserById("id-3"), fetchUserById("id-4")];
      }
      return args.ids.map((id: string) => fetchUserById(id));
    }
  },
  User: {
    __resolveReference(user: User){
      return fetchUserById(user.id)
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
  })
});

server.listen(process.env.PORT || 8002).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});