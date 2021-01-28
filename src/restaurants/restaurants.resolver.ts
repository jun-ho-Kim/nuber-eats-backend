import { Resolver, Query } from "../../node_modules/@nestjs/graphql";

@Resolver()
export class RestaurantsResolver {
    //returns부분은 arrow funtion을 만들기위한
    //arguments로 () => boolean 으로 사용하능하다.
    @Query(returns => Boolean) /* <- 이 return타입은 GraphQL를 위한 것 */
    isPizzaGood(): Boolean /* <- 이 return타입은 타입스크립트를 위한 것 */ {
        return true;
    }
}