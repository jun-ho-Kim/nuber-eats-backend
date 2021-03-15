import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../../node_modules/@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderResovler } from './order.resolver';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { OrderItem } from './entities/order-items.entity';
import { Dish } from '../restaurants/entities/dish.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
    providers: [OrderService, OrderResovler],
})
export class OrdersModule {}
