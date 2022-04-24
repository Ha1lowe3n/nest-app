import { ConfigService } from '@nestjs/config';
import { PageService } from './../page/page.service';
import { Controller, Get, Header } from '@nestjs/common';
import { Builder } from 'xml2js';
import { format, subDays } from 'date-fns';
import { CATEGORY_URL } from './sitemap.constants';

@Controller('sitemap')
export class SitemapController {
	domain: string;

	constructor(
		private readonly pageService: PageService,
		private readonly configService: ConfigService,
	) {
		this.domain = configService.get('DOMAIN') ?? '';
	}

	@Get('xml')
	@Header('content-type', 'text/xml')
	async sitemap() {
		const formatString = "yyyy-MM-dd'T'HH:mm:00.000xxx";
		const builder = new Builder({
			xmldec: { version: '1.0', encoding: 'UTF-8' },
		});

		let res = [
			{
				loc: this.domain,
				lastmod: format(subDays(new Date(), 1), formatString),
				changefreq: 'daily',
				priority: '1.0',
			},
			{
				loc: `${this.domain}/courses`,
				lastmod: format(subDays(new Date(), 1), formatString),
				changefreq: 'daily',
				priority: '1.0',
			},
		];

		const pages = await this.pageService.findAll();
		res = res.concat(
			pages.map((page) => ({
				loc: `${this.domain}/${CATEGORY_URL[page.pageCategory]}/${page.alias}`,
				lastmod: format(new Date(page.updatedAt), formatString),
				changefreq: 'weekly',
				priority: '0.7',
			})),
		);

		return builder.buildObject({
			urlset: {
				$: {
					xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
				},
				url: res,
			},
		});
	}
}
