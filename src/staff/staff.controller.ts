import { Body, Controller, Post } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { createStaffDto } from "./staff.dto";

@Controller('api/staff')
export class StaffController{
    constructor( 
        private readonly service: StaffService,
    ){}

    @Post('sign-up')
    async create(@Body() createStaffDto: createStaffDto){
        return this.service.createStaff(createStaffDto)
    }

}