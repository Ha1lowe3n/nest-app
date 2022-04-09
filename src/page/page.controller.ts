import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { FindPageDto } from './dto/find-page.dto';
import { PageModel } from './page.model';
import { PageService } from './page.service';

@Controller('page')
export class PageController {
	constructor(private readonly pageService: PageService) {}

	@Post('create')
	async create(@Body() dto: PageModel): Promise<void> {}

	@Get(':id')
	async get(@Param(':id') id: string): Promise<void> {}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: Partial<PageModel>): Promise<void> {}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<void> {}

	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindPageDto): Promise<void> {}
}
