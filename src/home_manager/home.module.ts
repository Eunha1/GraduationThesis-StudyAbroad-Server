import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Banner, BannerSchema, NewsAndEvent, NewsAndEventSchema, Testimonial, TestimonialSchema } from "./home.schema";
import { JwtService } from "@nestjs/jwt";
import { HomeManagerService } from "./home.service";
import { HomeManagerController } from "./home.controller";
import { PostModule } from "src/post_info/post.module";

@Module({
    imports: [
        forwardRef(()=>PostModule),
        ConfigModule,
        MongooseModule.forFeature([
            {name: Banner.name, schema: BannerSchema}
        ]),
        MongooseModule.forFeature([
            {name: NewsAndEvent.name, schema: NewsAndEventSchema}
        ]),
        MongooseModule.forFeature([
            {name: Testimonial.name, schema: TestimonialSchema}
        ])
    ],
    providers: [HomeManagerService,JwtService],
    controllers: [HomeManagerController],
    exports: [HomeManagerService]
})
export class HomeManagerModule {}