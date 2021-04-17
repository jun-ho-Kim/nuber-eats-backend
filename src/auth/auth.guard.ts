import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { SimpleConsoleLogger } from 'typeorm';
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
    if (!roles) {
      return true;
    }
    const gqlContext = await GqlExecutionContext.create(context).getContext();
<<<<<<< HEAD
    const token = gqlContext.token;
=======
    console.log("gqlContext.token", gqlContext.token)
    const token = gqlContext.token;
    // console.log("왜gqlContext.token이 안됬을까, authguard  token", token)
>>>>>>> 2c9480da23e3cbaec8e36df6c88ca08b4890be44
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);
<<<<<<< HEAD
        if (user) {
          gqlContext['user'] = user;
=======
        // console.log("authguard", user)
        if (user) {
          gqlContext['user'] = user;
          // console.log("gqlContext['user']", gqlContext['user'])
>>>>>>> 2c9480da23e3cbaec8e36df6c88ca08b4890be44
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