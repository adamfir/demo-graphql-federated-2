import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";

dotenv.config();

// define User type
interface User {
  id: string;
  username: string;
}

// static fetchUserById function
const fetchUserById = (id: string): User => {
  const user: User = {
    id,
    username: `John Doe ${id}`,
  };
  return user;
} 

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Query {
    me: User
    users: [User]
  }

  type User @key(fields: "id") {
    id: ID!
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return fetchUserById("1")
    },
    users() {
      return [fetchUserById("id-1"), fetchUserById("id-2"), fetchUserById("id-3"), fetchUserById("id-4")]
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