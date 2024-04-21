import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LocalityService } from "./locality.service";
import { Roles } from "src/role/role.decorator";
import { Role } from "src/enum/roles.enum";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RoleGuard } from "src/role/role.guard";
import { createLocality } from "./locality.dto";


@Controller('api/locality')
export class LocalityController{
    constructor(
        private readonly service : LocalityService
    ){}

    @Post('create-locality')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard,RoleGuard)
    async createLocality(@Body() createLocality: createLocality){
        if(!createLocality.area_type || createLocality.area_type == '' || !createLocality.area_name || createLocality.area_name == '' ){
            return {
                status : 0,
                message: 'Please enter all fields'
            }
        }
        return await this.service.createLocality(createLocality)
    }
}