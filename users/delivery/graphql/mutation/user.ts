// export createUser
export const createUser = (parent: any, args: any, context: any, info: any): User => {
  return {
    id: 'pseudo-id',
    username: args.username,
  }
}