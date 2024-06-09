import { InjectModel } from "@nestjs/mongoose";
import { Banner, BannerDocument, NewsAndEvent, NewsAndEventDocument, Testimonial, TestimonialDocument } from "./home.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { PostService } from "src/post_info/post.service";
import { newBanner, newTestimonial } from "./home.dto";

@Injectable()
export class HomeManagerService {
    constructor(
        @InjectModel(Banner.name)
        private readonly bannerModel: Model<BannerDocument>,

        @InjectModel(NewsAndEvent.name)
        private readonly newsAndEventModel: Model<NewsAndEventDocument>,

        @InjectModel(Testimonial.name)
        private readonly testimonialModel: Model<TestimonialDocument>,
        
        @Inject(forwardRef(()=> PostService))
        private postService: PostService,

        private config: ConfigService,

    ){}

    async getListBanner():Promise<any>{
        const listBanner = await this.bannerModel.find({})
        if(!listBanner){
            return {
                status: 0,
                message: 'Get list error'
            }
        }
        const web_url = this.config.get('WEB_URL');
        const data = []
        let count = 1
        for(let item of listBanner){
            const obj = {
                _id: item._id,
                stt: count++,
                title: item.title,
                type: item.type,
                image: web_url+ '/' + item.image
            }
            data.push(obj)
        }
        return {
            status: 1,
            message: 'Get list success',
            data: data
        }
    }

    async saveBanner(file: Express.Multer.File, newBanner: newBanner):Promise<any>{
        const data = {
            title: newBanner.title,
            type: newBanner.type,
            image: file ? file.destination + '/' + file.filename : file,
            created_at: new Date(),
            updated_at: new Date(),
        }
        const newInfo = await new this.bannerModel(data).save()
        if(!newInfo){
            return {
                status: 0,
                message: 'Create error'
            }
        } 
        return {
            status: 1,
            message: 'Create success'
        }
    }

    async getBannerByType(type: number):Promise<any>{
        const listBanner = await this.bannerModel.find({type: type})
        const web_url = this.config.get('WEB_URL');
        const data = []
        let count = 1
        for(let item of listBanner){
            const obj = {
                _id: item._id,
                stt: count++,
                title: item.title,
                type: item.type,
                image: web_url+ '/' + item.image
            }
            data.push(obj)
        }
        return {
            status : 1,
            message: 'Get banner success',
            data: data
        }
    }

    async deleteBanner(_id: string): Promise<any>{
        const data = await this.bannerModel.findByIdAndDelete(_id)
        if(!data){
            return {
                status: 0,
                message: 'Delete error'
            }
        }
        return {
            status: 1, 
            message: 'Delete success'
        }
    }

    async createNewsAndEvent(post: any, type: number):Promise<any>{
        const data = {
            ...post,
            type: type,
            created_at: new Date(),
            updated_at: new Date(),
        }
        const info = await new this.newsAndEventModel(data).save()
        if(!info){
            return {
                status: 0,
                message: 'Create error'
            }
        }
        return {
            status: 1,
            message: 'Create success'
        }
    }
    async getListNewAndEvent():Promise<any>{
        const list = await this.newsAndEventModel.find({})
        
        const info =[]
        let count = 1
        for(let item of list){
            const post_info = await this.postService.findPostByID(item.post)
            const obj = {
                _id: item._id,
                stt: count++,
                type: item.type,
                post_title: post_info.title
            }
            info.push(obj)
        }
        return {
            status: 0,
            message: 'Get list success',
            data: info
        }
    }

    async getNewsAndEventByID(_id: string):Promise<any>{
        const info = await this.newsAndEventModel.findById(_id)
        if(!info){
            return {
                status: 0,
                message: 'Get detail error'
            }
        }
        const data = {
            type: info.type,
            post_info : await this.postService.getPostById(info.post)
        }
        return {
            status: 1,
            message: 'Get detail success',
            data: info
        }

    }
    async getNewsAndEventByType(type: number):Promise<any>{
        const list = await this.newsAndEventModel.find({"type": type})
        const info =[]
        let count = 1
        for(let item of list){
            const obj = {
                _id: item._id,
                stt: count++,
                type: item.type,
                post_info: await this.postService.findPostByID(item.post)
            }
            info.push(obj)
        }
        return {
            status: 0,
            message: 'Get list success',
            data: info
        }
    }
    async deleteNewsAndEvent(_id: string):Promise<any>{
        const data = await this.newsAndEventModel.findByIdAndDelete(_id)
        if(!data){
            return {
                status: 0,
                message:'Delete error'
            }
        }

        return {
            status: 1,
            message: 'Delete success'
        }
    }
    async getTestimonialByID(_id: string):Promise<any>{
        const data = await this.testimonialModel.findById(_id)
        if(!data){
            return {
                status: 0,
                message: 'Get detail Error'
            }
        }
        const web_url = this.config.get('WEB_URL');
        const info = {
            image : web_url + '/' + data.avatar,
            name: data.name,
            description : data.description,
            content: data.content
        }
        return {
            status: 1,
            message: 'Get detail success',
            data: info
        }
    }
    async createNewTestimonial(avatar: Express.Multer.File, newTestimonial: newTestimonial):Promise<any>{
        const data = {
            ...newTestimonial,
            avatar: avatar ? avatar.destination + '/' + avatar.filename : avatar,
            created_at: new Date(),
            updated_at: new Date(),
        }
        const newInfo = await new this.testimonialModel(data).save()
        if(!newInfo){
            return {
                status: 0, 
                message: 'Create error'
            }
        }
        return {
            status: 1,
            message: 'Create success'
        }
    }
    
    async updateTestimonial(_id: string, body: any, avatar: Express.Multer.File):Promise<any>{
        const data = {
            avatar: avatar ? avatar.destination + '/' + avatar.filename : avatar,
            ...body 
        }
        const info = await this.testimonialModel.findByIdAndUpdate(_id, data)
        if(!info){
            return {
                status: 0,
                message: 'Cập nhật không thành công'
            }
        }
        return {
            status: 1,
            message: 'Cập nhật thành công'
        }
    }
    async getListTestimonial():Promise<any>{
        const listInfo = await this.testimonialModel.find({})
        const web_url = this.config.get('WEB_URL');
        let count = 1
        const data = []
        for(let item of listInfo){
            const obj = {
                _id: item._id,
                stt: count++,
                image: web_url + '/' + item.avatar,
                name: item.name,
                description: item.description,
                content: item.content
            }
            data.push(obj)
        }
        return {
            status: 1, 
            message: 'Get list success',
            data: data
        }
    }

    async deleteTestimonial(_id: string):Promise<any>{
        const data = await this.testimonialModel.findByIdAndDelete(_id)
        if(!data){
            return {
                status: 0,
                message:'Delete error'
            }
        }

        return {
            status: 1,
            message: 'Delete success'
        }
    }
}