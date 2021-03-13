import { Resolver, Mutation, ArgsType, Args } from "../../node_modules/@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { Role } from "../auth/role.decorator";
import { AuthUser } from "../auth/auth-user.decorator";
import { User } from "../users/entities/user.entity";


@Resolver(of => Order)
export class OrderResovler {
    constructor(private readonly ordersService: OrderService) {}

    @Mutation(returns => CreateOrderOutput)
    // @Role(['Client'])
    async createOrder(
        @AuthUser() customer: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        return this.ordersService.createOrder(customer, createOrderInput);
    }
}