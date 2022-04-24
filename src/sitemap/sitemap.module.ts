import { Module } from '@nestjs/common';
import { PageModule } from 'src/page/page.module';

import { SitemapController } from './sitemap.controller';

@Module({
	imports: [PageModule],
	controllers: [SitemapController],
})
export class SitemapModule {}
