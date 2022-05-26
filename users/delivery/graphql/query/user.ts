// static fetchUserById function
const fetchUserById = (id: string): User => {
  const user: User = {
    id,
    username: `John Doe ${id}`,
  };
  return user;
}

// me query
export const me = (parent: any, args: any, context: any, info: any) => {
  return fetchUserById("1")
}

// users query
export const users = (parent: any, args: any, context: any, info: any) => {
  if (!args.ids) {
    return [fetchUserById("id-1"), fetchUserById("id-2"), fetchUserById("id-3"), fetchUserById("id-4")];
  }
  return args.ids.map((id: string) => fetchUserById(id));
}