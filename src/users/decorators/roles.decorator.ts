import { SetMetadata } from '@nestjs/common';

// Key used to store and retrieve metadata
export const ROLES_KEY = 'roles'; 

// The decorator function
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

















//for eg , we pass 'admin' , 'user' as roles to the Roles decorator as @Roles('admin', 'user')
// then it will set the metadata with key 'roles' and value ['admin', 'user'] for that route handler
// as similar to the object below
// {
//   "roles": ['admin', 'user']
// }