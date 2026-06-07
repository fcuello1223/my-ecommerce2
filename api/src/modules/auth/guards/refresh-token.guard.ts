import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//Guard for Protecting Refresh Token Endpoints
@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {

}
