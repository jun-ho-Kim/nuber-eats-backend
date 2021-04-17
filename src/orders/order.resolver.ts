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
<<<<<<< HEAD
import { Inject } from "@nestjs/common";
import { PUB_SUB } from "src/common/common.constants";
import { validateOrReject } from "class-validator";
=======

const pubsub = new PubSub();
>>>>>>> 2c9480da23e3cbaec8e36df6c88ca08b4890be44

@Resolver(of => Order)
export class OrderResovler {
    constructor(
        private readonly ordersService: OrderService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
        ) {}

    @Mutation(returns => CreateOrderOutput)
    // @Role(['Client'])
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
    }

    @Query(returns => GetOrderOutput)
    // @Role(["Any"])
    async getOrder(
        @AuthUser() user: User,
        @Args('input') getOrderInput: GetOrderInput
    ): Promise<GetOrderOutput> {
        return this.ordersService.getOrder(user, getOrderInput);
    }

    @Mutation(returns => EditOrderOutput)
    // @Role(["Any"])
    // @Role(["Owner", "Delivery"])
    async editOrder(
        @AuthUser() user: User,
        @Args('input') editOrderInput: EditOrderInput
    ): Promise<EditOrderOutput> {
        return this.ordersService.editOrder(user, editOrderInput);
    }

    @Mutation(returns => Boolean)
<<<<<<< HEAD
    async potatoReady(@Args('potatoId') potatoId: number) {
        await this.pubSub.publish('hotPotato', {
            readyPotato: potatoId
        });
        return false;
    }

    @Subscription(returns => String, {
        filter: ({readyPotato}, {potatoId}) => {
            return potatoId  !== readyPotato;
        }
    })
    readyPotato(
        @Args('potatoId') potatoId: number ) {
        return this.pubSub.asyncIterator("hotPotato");
=======
    @Role(["Any"])
    potatoReady() {
        pubsub.publish('hotPotato', {
            readyPotato: "You potato is ready. love you "
        });
        return true;
    }

    @Subscription(returns => String)
    @Role(["Any"])
    readyPotato(@AuthUser() user: User) {
        console.log("subscribe User:", user);
        return pubsub.asyncIterator("hotPotato");
>>>>>>> 2c9480da23e3cbaec8e36df6c88ca08b4890be44
    }
}