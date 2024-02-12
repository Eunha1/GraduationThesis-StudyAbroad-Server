import { Module } from '@nestjs/common';
import { Commission, CommissionSchema } from './commission.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commission.name, schema: CommissionSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class CommissionModule {}
