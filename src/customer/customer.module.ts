import { Module } from '@nestjs/common';
import { Customer, CustomerSchema } from './customer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  providers: [CustomerService, JwtService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
