import { Response, Request, NextFunction } from "express";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        if('x-jwt' in req.headers) {
            const token = req.headers['x-jwt'];
            try{
                const decoded = this.jwtService.verify(token.toString());
                console.log("decoded", decoded);
                console.log("req.header", req.headers);
                if(typeof decoded === "object" && decoded.hasOwnProperty('id')) {
                    const { user, ok } = await this.userService.findById(decoded['id']);
                    if(ok) {
                        req['user'] = user;
                        console.log("req['user'] = user;",  req['user']);
                    }
                }
            } catch (e) {}
            
        }
        next();
    }
}