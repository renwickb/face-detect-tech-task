import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Role, User } from "../user";
import { ROLES_KEY } from "./role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest<Express.Request>();
        const user = request.user as User;
        return requiredRoles.some((role) => user.role === role);
    }
}
