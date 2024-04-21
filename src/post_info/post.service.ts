import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post_info, Post_infoDocument } from "./post.schema";
import { Model } from "mongoose";

@Injectable()
export class PostService{
    constructor(
        @InjectModel(Post_info.name)
        private readonly postModel: Model<Post_infoDocument>
    ){}
}