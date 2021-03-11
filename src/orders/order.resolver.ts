import { Resolver, Mutation, ArgsType, Args } from "../../node_modules/@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { CreateOrderInput } from "./dtos/create-order.dto";
import { Role } from "../auth/role.decorator";
import { AuthUser } from "../auth/auth-user.decorator";
import { User } from "../users/entities/user.entity";
import { CreateAccountOutput } from "../users/dtos/create-account.dto";


@Resolver(of => Order)
export class OrderResovler {
    constructor(private readonly orderService: OrderService) {}

    @Mutation(returns => CreateOrderInput)
    @Role(['Client'])
    async createOrder(
        @AuthUser() customer: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreateAccountOutput> {
        return {
            ok: true
        };
    }
}