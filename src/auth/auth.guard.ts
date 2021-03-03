import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "../../node_modules/@nestjs/graphql";
import { Reflector } from "../../node_modules/@nestjs/core";
import { AllowdRoles } from "./role.decorator";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<AllowdRoles>(
            'roles',
            context.getHandler()
        );
        if(!roles) {
            return true;
        }
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user: User = gqlContext['user'];
        if(!user) {
            return false;
        };
        if(user) {
            gqlContext['user'] = user;
            return roles.includes('Any') || roles.includes(user.role);     
        } else {
                return false;
        }
    };
};
