import { Module, forwardRef } from '@nestjs/common';
import { Commission, CommissionSchema } from './commission.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommissionController } from './commission.controller';
import { CommissionService } from './commission.service';
import { JwtService } from '@nestjs/jwt';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commission.name, schema: CommissionSchema },
    ]),
    forwardRef(() => CustomerModule),
  ],
  controllers: [CommissionController],
  providers: [CommissionService, JwtService],
  exports: [CommissionService],
})
export class CommissionModule {}
