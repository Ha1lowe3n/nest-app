import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { CreatePageDto } from './dto/create-page.dto';
import { PageCategories, PageModel } from './page.model';
import { PageErrorMessages } from '../errors/errors-messages';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
	constructor(@InjectModel(PageModel) private readonly pageModel: ModelType<PageModel>) {}

	async create(dto: CreatePageDto): Promise<DocumentType<PageModel>> {
		return await this.pageModel.create(dto);
	}

	async findById(id: string): Promise<DocumentType<PageModel>> {
		const page = await this.pageModel.findById(id);
		if (!page) {
			throw new HttpException(PageErrorMessages.PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return page;
	}

	async findAll(): Promise<DocumentType<PageModel>[]> {
		return await this.pageModel.find({});
	}

	async updateById(id: string, dto: UpdatePageDto): Promise<DocumentType<PageModel>> {
		const page = await this.pageModel.findByIdAndUpdate(id, dto, { new: true });
		if (!page) {
			throw new HttpException(PageErrorMessages.PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return page;
	}

	async deleteById(id: string): Promise<DocumentType<PageModel>> {
		const page = await this.pageModel.findByIdAndDelete(id);
		if (!page) {
			throw new HttpException(PageErrorMessages.PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return page;
	}

	async findByCategory(
		pageCategory: PageCategories,
	): Promise<Pick<DocumentType<PageModel>, 'alias' | 'pageCategory' | 'subPageCategory'>[]> {
		const pages = await this.pageModel
			.aggregate()
			.match({ pageCategory })
			.group({
				_id: { subPageCategory: '$subPageCategory' },
				pages: { $push: { alias: '$alias', title: '$title' } },
			});

		if (!pages.length) {
			throw new HttpException(PageErrorMessages.PAGES_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return pages;
	}

	async findByAlias(alias: string): Promise<DocumentType<PageModel>> {
		const page = await this.pageModel.findOne({ alias });
		if (!page) {
			throw new HttpException(PageErrorMessages.PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return page;
	}

	async findByText(text: string): Promise<DocumentType<PageModel>[]> {
		const pages = await this.pageModel.find({
			$text: { $search: text, $caseSensitive: false },
		});
		if (!pages.length) {
			throw new HttpException(PageErrorMessages.PAGES_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return pages;
	}
}
