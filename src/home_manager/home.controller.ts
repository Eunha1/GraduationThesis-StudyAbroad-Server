import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { HomeManagerService } from "./home.service";
import { Role } from "src/enum/roles.enum";
import { Roles } from "src/role/role.decorator";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RoleGuard } from "src/role/role.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { storageConfig } from "helpers/config";
import { extname } from "path";
import { newBanner, newTestimonial } from "./home.dto";

@Controller('api/home-manager')
export class HomeManagerController{
    constructor(private readonly service: HomeManagerService){}

    @Get('/list-banner')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async getListBanner(){
        return await this.service.getListBanner()
    }

    @Post('/new-banner')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @UseInterceptors(
        FileInterceptor('image',{
            storage: storageConfig('home-manager/banner'),
            fileFilter: (req, file, callback)  => {
                const ext = extname(file.originalname)
                const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
                if (!allowedExtArr.includes(ext)) {
                req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
                callback(null, false);
                } else {
                callback(null, true);
                }
            }
        })
    )
    async createNewBanner(@Body() newBanner: newBanner,@UploadedFile() file: Express.Multer.File, @Req() req: any){
        if(!newBanner.type){
            return {
                status: 0, 
                message:'Vui lòng chọn kiểu banner'
            }
        }
        if(!file){
            return {
                status : 0,
                message: 'Vui lòng thêm ít nhất một ảnh'
            }
        }
        if (req.fileValidatorError) {
            throw new BadRequestException(req.fileValidatorError);
        }
        return await this.service.saveBanner(file, newBanner)
    }

    @Get('/get-banner')
    async getBannerByType(@Query('type') type: number){
        return await this.service.getBannerByType(type)
    }

    @Post('/delete-banner/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async deleteBanner(@Param('id') id: string){
        return await this.service.deleteBanner(id)
    }

    @Post('/create/news-and-event')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async createNewsAndEvent(@Body() post: any,@Query('type') type: number ){
        if(!post){
            return {
                status: 0,
                message: 'Vui lòng thêm bài viết'
            }
        }
        return await this.service.createNewsAndEvent(post, type)
    }

    @Get('/news-and-event/list')
    async getListNewsAndEvent(){
        return await this.service.getListNewAndEvent()
    }

    @Get('/news-and-event/type')
    async getListNewsAndEventByType(@Query('type') type: number){
        return await this.service.getNewsAndEventByType(type)
    }

    @Get('/news-and-event/:id')
    async getNewsAndEventByID(@Param('id') id: string){
        return await this.service.getNewsAndEventByID(id)
    }

    @Post('/delete/news-and-event/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async deleteNewsAndEvent(@Param('id') id: string){
        return await this.service.deleteNewsAndEvent(id)
    }
    @Post('/new-testimonial')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @UseInterceptors(
        FileInterceptor('image',{
            storage: storageConfig('home-manager/testimonial'),
            fileFilter: (req, file, callback)  => {
                const ext = extname(file.originalname)
                const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
                if (!allowedExtArr.includes(ext)) {
                req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
                callback(null, false);
                } else {
                callback(null, true);
                }
            }
        })
    )
    async createNewTestimonial(@UploadedFile() file: Express.Multer.File, @Body() newTestimonial : newTestimonial, @Req() req: any){
        if(newTestimonial.name === '' || !newTestimonial.name || newTestimonial.content === '' || !newTestimonial.content){
            return {
                status: 0, 
                message: 'Vui lòng thêm nội dung và tên'
            }
        }
        if (req.fileValidatorError) {
            throw new BadRequestException(req.fileValidatorError);
        }
        return await this.service.createNewTestimonial(file, newTestimonial)
    }

    @Post('/update-testimonial/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @UseInterceptors(
        FileInterceptor('image',{
            storage: storageConfig('home-manager/testimonial'),
            fileFilter: (req, file, callback)  => {
                const ext = extname(file.originalname)
                const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
                if (!allowedExtArr.includes(ext)) {
                req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
                callback(null, false);
                } else {
                callback(null, true);
                }
            }
        })
    )
    async updateTestimonial(@Param('id') id: string, @Body() body: any,@UploadedFile() file: Express.Multer.File, @Req() req: any){
        console.log(body)
        if(!body.name || body.name === '' || !body.content || body.content === ''){
            return {
                status: 0,
                message: 'Vui lòng thêm tên và nội dung'
            }
        }
        if (req.fileValidatorError) {
            throw new BadRequestException(req.fileValidatorError);
        }
        return await this.service.updateTestimonial(id, body, file)
    }

    @Get('/testimonial/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async getTestimonialByID(@Param('id') id : string){
        return await this.service.getTestimonialByID(id)
    }

    @Get('/list-testimonial')
    async getListTestimonial(){
        return await this.service.getListTestimonial()
    }

    @Post('/delete-testimonial/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async deleteTestimonial(@Param('id') id: string){
        return await this.service.deleteTestimonial(id)
    }
}