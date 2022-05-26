import Query from "./query";
import Mutation from "./mutation";
import { UserType } from "./type/user";

const resolvers = {
  Query,
  Mutation,
  User: UserType,
}

export default resolvers;