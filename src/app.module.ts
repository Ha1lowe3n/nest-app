import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { AuthModule } from './auth/auth.module';
import { getMongoConfig } from './configs/mongo.config';
import { PageModule } from './page/page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { FilesModule } from './files/files.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypegooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		PageModule,
		ProductModule,
		ReviewModule,
		FilesModule,
	],
})
export class AppModule {}
