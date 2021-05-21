import { Resolver, Mutation, ArgsType, Args, Query, Subscription } from "../../node_modules/@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { Role } from "../auth/role.decorator";
import { AuthUser } from "../auth/auth-user.decorator";
import { User } from "../users/entities/user.entity";
import { GetOrdersOutput, GetOrdersInput } from "./dtos/get-orders.dto";
import { GetOrderOutput, GetOrderInput } from "./dtos/get-order.dto";
import { EditOrderOutput, EditOrderInput } from "./dtos/edit-order.dto";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/common/common.constants";
import { validateOrReject } from "class-validator";
import { OrderUpdatesInput } from "./dtos/order-updates.dto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/take-order.dto";
import { IoTSecureTunneling } from "aws-sdk";

@Resolver(of => Order)
export class OrderResovler {
    constructor(
        private readonly ordersService: OrderService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
        ) {}

    @Mutation(returns => CreateOrderOutput)
    @Role(['Client'])
    async createOrder(
        @AuthUser() customer: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        return this.ordersService.createOrder(customer, createOrderInput);
    }

    @Query(returns => GetOrdersOutput)
    // @Role(["Any"])
    async getOrders(
        @AuthUser() user: User,
        @Args('input') getOrdersInput: GetOrdersInput,
    ): Promise<GetOrdersOutput> {
        return this.ordersService.getOrders(user, getOrdersInput);
    };

    @Mutation(returns => EditOrderOutput)
    @Role(["Owner"])
    async editOrder(
        @AuthUser() user: User,
        @Args('input') editOrderInput: EditOrderInput
    ): Promise<EditOrderOutput> {
        return this.ordersService.editOrder(user, editOrderInput);
    };

    @Subscription(returns => Order, {
        filter: ({pendingOrders: {ownerId}}, _, {user}) => {
            console.log("ownerId", ownerId, "user.id", user.id);
            return ownerId === user.id;
        },
        resolve: ({pendingOrders: {order}}) => order,
    })
    @Role(["Any"])
    pendingOrders() {
        return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
    }

    @Subscription(returns => Order)
    // @Role(['Delivery'])
    cookedOrders() {
        return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
    }

    @Subscription(returns => Order, {
        filter: (
            {orderUpdates: order}: {orderUpdates: Order},
            {input}: {input: OrderUpdatesInput},
            {user} : {user: User}
            ) => {
                if(
                    order.driverId !== user.id && 
                    order.customerId !== user.id &&
                    order.restaurant.ownerId !== user.id
                ) {
                    return false;
                }
                return order.id === input.id;
            }
        })
        @Role(['Any'])
        orderUpdates(@Args('input') orderUpdatesInput: OrderUpdatesInput) {
        return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
    }
    @Mutation(returns => TakeOrderOutput)
    @Role(['Delivery'])
    takeOrder(
        @AuthUser() driver: User,
        @Args('input') takeOrderInput: TakeOrderInput
    ) {
        console.log("driver" ,driver)
        return this.ordersService.takeOrder(driver, takeOrderInput);
    };
}