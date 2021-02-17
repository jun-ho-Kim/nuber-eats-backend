import { createParamDecorator, ExecutionContext } from "../../node_modules/@nestjs/common";
import { GqlExecutionContext } from "../../node_modules/@nestjs/graphql";

export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user = gqlContext['user'];
        return user;
    }
)