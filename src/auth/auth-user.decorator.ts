import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const AuthUser = createParamDecorator (
    async (data: unknown, context: ExecutionContext) =>  {
        const gqlContext = await GqlExecutionContext.create(context).getContext();
        console.log("gqlContext['user']", gqlContext['user'])
        const user = gqlContext['user'];
        return user;
    }
)