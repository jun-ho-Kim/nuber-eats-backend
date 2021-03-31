import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const AuthUser = createParamDecorator (
    async (data: unknown, context: ExecutionContext) =>  {
        const gqlContext = await GqlExecutionContext.create(context).getContext();
        console.log("gqlContext", gqlContext)
        const user = gqlContext['user'];
        console.log("gqlContext['user']", user);
        return user;
    }
)