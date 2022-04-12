import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreatePageDto } from './dto/create-page.dto';
import { FindPageDto } from './dto/find-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageModel } from './page.model';
import { PageService } from './page.service';

@Controller('page')
export class PageController {
	constructor(private readonly pageService: PageService) {}

	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreatePageDto): Promise<DocumentType<PageModel>> {
		return await this.pageService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(
		@Body() dto: FindPageDto,
	): Promise<Pick<DocumentType<PageModel>, 'alias' | 'pageCategory' | 'subPageCategory'>[]> {
		return await this.pageService.findByCategory(dto.pageCategory);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string): Promise<DocumentType<PageModel>> {
		return await this.pageService.findById(id);
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string): Promise<DocumentType<PageModel>> {
		return await this.pageService.findByAlias(alias);
	}

	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdatePageDto,
	): Promise<DocumentType<PageModel>> {
		return await this.pageService.updateById(id, dto);
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<DocumentType<PageModel>> {
		return await this.pageService.deleteById(id);
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string): Promise<DocumentType<PageModel>[]> {
		return this.pageService.findByText(text);
	}
}
