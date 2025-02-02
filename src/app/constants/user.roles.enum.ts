/**
 * UserRoles
 * Represents the available roles for users in the system.
 * @enum {string}
 */
enum UserRoles {
  ADMIN = "Admin",
  MODERATOR = "Moderator",
  USER = "User"
}

/**
 * LevelOne
 * Represents the roles that all logged in users have.
 * @type {UserRoles[]}
 */
export const LevelOne: UserRoles[] = [...Object.values(UserRoles)];

/**
 * LevelTwo
 * Represents the roles that users with even higher privileges have.
 * @type {UserRoles[]}
 */
export const LevelTwo: UserRoles[] = [UserRoles.ADMIN, UserRoles.MODERATOR];

/**
 * LevelThere
 * Represents the roles that users with the highest privileges have.
 * @type {UserRoles[]}
 */
export const LevelThere: UserRoles[] = [UserRoles.ADMIN];

export default UserRoles;
