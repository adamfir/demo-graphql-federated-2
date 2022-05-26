import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";

dotenv.config();

// define Profile type
interface Profile {
  id: string;
  address: string;
}

// define User type
interface User {
  id: string;
  profile: Profile;
}

// static fetchProfileById function
const fetchProfileById = (id: string): Profile => {
  const profile: Profile = {
    id,
    address: `Address for id=${id}`,
  };
  return profile;
} 

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Profile @key(fields: "id") {
    id: ID!
    address: String
  }

  type User @key(fields: "id") {
    id: ID!
    profile: Profile
  }
`;

const resolvers = {
  User: {
    __resolveReference(user: User){
      user.profile = fetchProfileById(user.id);
      return user;
    }
  },
  Profile: {
    __resolveReference(profile: Profile){
      return fetchProfileById(profile.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
  })
});

server.listen(process.env.PORT || 8003).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});