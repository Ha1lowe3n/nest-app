import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from '../src/auth/auth.module';
import { PageModule } from '../src/page/page.module';
import { ProductModule } from '../src/product/product.module';
import { ReviewModule } from '../src/review/review.module';
import { getMockMongoConfig } from '../src/configs/mock-mongo.config';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMockMongoConfig,
		}),
		AuthModule,
		PageModule,
		ProductModule,
		ReviewModule,
	],
})
export class MockAppModule {}
