import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PageModel } from './page.model';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: PageModel,
				schemaOptions: {
					collection: 'Page',
				},
			},
		]),
	],
	controllers: [PageController],
	providers: [PageService],
	exports: [PageService],
})
export class PageModule {}
