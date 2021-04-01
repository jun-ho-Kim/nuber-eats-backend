import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(context: ExecutionContext) {
//     const gqlContext = GqlExecutionContext.create(context).getContext(); // change http context to graphql context
//     const user = gqlContext['user'];
//     console.log("gqlContext['user']", user)
//     if (!user) {
//       return false;
//     }
//     return true;
//   }
// }
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    console.log("const roles", roles);
    if (!roles) {
      return true;
    }
    const gqlContext = await GqlExecutionContext.create(context).getContext();
    console.log("authguard  gqlContext", gqlContext.req.headers['x-jwt'])
    const token = gqlContext.req.headers['x-jwt'];
    console.log("왜gqlContext.token이 안됬을까, authguard  token", token)
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);
        console.log("authguard", user)
        if (user) {
          gqlContext['user'] = user;
          console.log("gqlContext['user']", gqlContext['user'])
          if (roles.includes('Any')) {
            return true;
          }
          return roles.includes(user.role);
        }
      }
    }
    return false;
  }
}