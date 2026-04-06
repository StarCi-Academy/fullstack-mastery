import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../mysql/schemas/user-role.enum';

export const ROLES_KEY = 'roles';

/** Metadata reflect: route yêu cầu một trong các role */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
