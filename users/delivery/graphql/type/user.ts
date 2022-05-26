// static fetchUserById function
const fetchUserById = (id: string): User => {
  const user: User = {
    id,
    username: `John Doe ${id}`,
  };
  return user;
}

// User resolver
export const UserType = {
  __resolveReference(user: User){
    return fetchUserById(user.id)
  },
  username(user: User) {
    // you can customize return value here
    return user.username;
  }
}