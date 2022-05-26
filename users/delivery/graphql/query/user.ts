import { getUserById, getUsers } from "../../../service/user";

// me query
export const me = (parent: any, args: any, context: any, info: any) => {
  return getUserById("me")
}

// users query
export const users = (parent: any, args: any, context: any, info: any) => {
  return getUsers(args.ids);
}