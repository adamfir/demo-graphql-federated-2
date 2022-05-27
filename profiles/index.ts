import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";

dotenv.config();

// define Profile type
interface Profile {
  id: string;
  address?: string;
  user?: User;
}

// define User type
interface User {
  id: string;
  profile?: Profile;
}

// static fetchProfileById function
const fetchProfileById = (id: string): Profile => {
  const profile: Profile = {
    id,
    address: `Psr. Sudiarto No. 793 ${id}`,
    user: {
      id: id,
    }
  };
  return profile;
} 

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Query {
    profile(id: ID!): Profile
  }

  type Profile @key(fields: "id") {
    id: ID!
    address: String
    user: User
  }

  type User @key(fields: "id") {
    id: ID!
    profile: Profile
  }
`;

const resolvers = {
  Query: {
    profile(parent: any, args: any, context: any, info: any) {
      return fetchProfileById(args.id);
    }
  },
  User: {
    profile(user: User){
      return fetchProfileById(user.id);
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
  }),
  context: ({ req }) => {
    const ctx : {
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

server.listen(process.env.PORT || 8003).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});