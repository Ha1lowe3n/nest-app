import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { AuthModule } from './auth/auth.module';
import { getMongoConfig } from './configs/mongo.config';
import { PageModule } from './page/page.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { FilesModule } from './files/files.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TelegramModule } from './telegram/telegram.module';
import { getTelegramConfig } from './configs/telegram.config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypegooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		TelegramModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
		AuthModule,
		PageModule,
		ProductModule,
		ReviewModule,
		FilesModule,
		SitemapModule,
	],
})
export class AppModule {}
