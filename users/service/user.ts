export const getUserById = (id: string): User => {
  const user: User = {
    id,
    username: `John Doe ${id}`,
  };
  return user;
}

export const getUsers = (ids: string[]): User[] => {
  if (!ids) {
    return [getUserById("id-1"), getUserById("id-2"), getUserById("id-3"), getUserById("id-4")];
  }
  return ids.map((id: string) => getUserById(id));
}
