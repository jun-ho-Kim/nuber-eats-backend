import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../users/entities/user.entity";

export type AllowdRoles = keyof typeof UserRole | 'Any';
export const Role = (roles: AllowdRoles[]) => SetMetadata('roles', roles);