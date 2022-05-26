// UserType resolver
export const UserType = {
  username(user: User) {
    // you can customize return value here
    return user.username;
  }
}