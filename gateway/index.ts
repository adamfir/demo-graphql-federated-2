import { ApolloServer, AuthenticationError } from "apollo-server";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { readFileSync } from "fs";
import { GraphQLRequest } from 'apollo-server-types';

const supergraphSdl = readFileSync('./supergraph.graphql').toString();
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({request, context}: {request: GraphQLRequest, context: any}) {
    request.http?.headers.set('Authorization', context.token);
    request.http?.headers.set('x-user-roles', context.roles?.join(','));
    request.http?.headers.set('x-user-id', context.userId);
  }
}

const gateway = new ApolloGateway({
  supergraphSdl,
  buildService: ({ url }) => {
    return new AuthenticatedDataSource({ url });
  }
});
const server = new ApolloServer({
  gateway,
  context: ({ req }) => {
    const ctx: {
      token?: string;
      roles: string[];
      userId?: string;
    } = {
      token: req.headers.authorization,
      roles: [],
    }

    if (req.headers.authorization) {
      // TODO: put any auth validation here, below just example
      if (req.headers.authorization === 'reject-me') {
        throw new AuthenticationError('not authorized');
      } else if (req.headers.authorization === 'allow-me') {
        ctx.roles.push('user');
        ctx.userId = 'id-123';
      }
    }

    return ctx;
  }
});

server.listen({ port: process.env.PORT || 8001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
}).catch(e => {
  console.error(e);
});
