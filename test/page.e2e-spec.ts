import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect, Types } from 'mongoose';

import { CommonErrorMessages, PageErrorMessages } from '../src/errors/errors-messages';
import { MockAppModule } from './mock-app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreatePageDto } from '../src/page/dto/create-page.dto';
import { UpdatePageDto } from '../src/page/dto/update-page.dto';

describe('ProductController (e2e)', () => {
	let app: INestApplication;
	let pageId: string;
	let token: string;

	const testCreatePageDto: CreatePageDto = {
		pageCategory: 2,
		subPageCategory: 'Облачные',
		alias: 'hosting',
		title: 'FirstVDS',
		category: 'javascript',
		hh: {
			count: 1000,
			juniorSalary: 120000,
			middleSalary: 220000,
			seniorSalary: 350000,
		},
		advantages: [
			{
				title: 'Скорость разработки',
				description: 'Мое описание',
			},
		],
		seoText: 'тест',
		tagsTitle: 'Полученные знания',
		tags: ['TypeScript'],
	};
	const fakeId = new Types.ObjectId().toHexString();
	const newUser: AuthDto = { email: 'token@mail.ru', password: 'givetoken' };

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MockAppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const {
			body: { access_token },
		} = await request(app.getHttpServer()).post('/auth/login').send(newUser);

		if (!access_token) {
			await request(app.getHttpServer()).post('/auth/register').send(newUser).expect(201);
			const {
				body: { access_token },
			} = await request(app.getHttpServer()).post('/auth/login').send(newUser).expect(200);
			token = access_token;
		} else {
			token = access_token;
		}
	});

	afterAll(async () => await disconnect());

	describe('/page/create (POST)', () => {
		it('success - create new page', async () => {
			return request(app.getHttpServer())
				.post('/page/create')
				.set('Authorization', 'Bearer ' + token)
				.send(testCreatePageDto)
				.expect(201)
				.then(({ body }: request.Response) => {
					pageId = body._id;
					expect(body._id).toBeDefined();
					expect(body.pageCategory).toBe(2);
					expect(body.subPageCategory).toBe('Облачные');
					expect(body.alias).toBe('hosting');
					expect(body.title).toBe('FirstVDS');
					expect(body.category).toBe('javascript');
					expect(body.hh).toEqual({
						count: 1000,
						juniorSalary: 120000,
						middleSalary: 220000,
						seniorSalary: 350000,
					});
					expect(body.advantages).toEqual([
						{
							title: 'Скорость разработки',
							description: 'Мое описание',
						},
					]);
					expect(body.seoText).toEqual('тест');
					expect(body.tagsTitle).toEqual('Полученные знания');
					expect(body.tags).toEqual(['TypeScript']);
				});
		});

		it('fail - create new page with invalid token', async () => {
			return request(app.getHttpServer())
				.post('/page/create')
				.set('Authorization', 'Bearer ' + 'token')
				.send(testCreatePageDto)
				.expect(401, {
					statusCode: 401,
					message: 'Unauthorized',
				});
		});
	});

	describe('/page/:pageId (GET)', () => {
		it('success - get page by pageId', async () => {
			return request(app.getHttpServer())
				.get(`/page/${pageId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body._id).toBeDefined();
					expect(body.pageCategory).toBe(2);
					expect(body.subPageCategory).toBe('Облачные');
					expect(body.alias).toBe('hosting');
					expect(body.title).toBe('FirstVDS');
					expect(body.category).toBe('javascript');
					expect(body.hh).toEqual({
						count: 1000,
						juniorSalary: 120000,
						middleSalary: 220000,
						seniorSalary: 350000,
					});
					expect(body.advantages).toEqual([
						{
							title: 'Скорость разработки',
							description: 'Мое описание',
						},
					]);
					expect(body.seoText).toEqual('тест');
					expect(body.tagsTitle).toEqual('Полученные знания');
					expect(body.tags).toEqual(['TypeScript']);
					expect(body.createdAt).toBeDefined();
					expect(body.updatedAt).toBeDefined();
				});
		});

		it('fail - get page by pageId with invalid token', async () => {
			return request(app.getHttpServer())
				.get(`/page/${pageId}`)
				.set('Authorization', 'Bearer ' + 'token')
				.expect(401, {
					statusCode: 401,
					message: 'Unauthorized',
				});
		});

		it('fail - get page by pageId with fake id', async () => {
			return request(app.getHttpServer())
				.get(`/page/${fakeId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(404, {
					statusCode: 404,
					message: PageErrorMessages.PAGE_NOT_FOUND,
				});
		});

		it('fail - get page by pageId with invalid id', async () => {
			return request(app.getHttpServer())
				.get(`/page/${123}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(400, {
					statusCode: 400,
					message: CommonErrorMessages.ID_VALIDATION_ERROR,
				});
		});
	});

	describe('/page/byAlias/:alias (GET)', () => {
		it('success - get page by alias', async () => {
			return request(app.getHttpServer())
				.get(`/page/byAlias/hosting`)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body._id).toBeDefined();
					expect(body.pageCategory).toBe(2);
					expect(body.subPageCategory).toBe('Облачные');
					expect(body.alias).toBe('hosting');
					expect(body.title).toBe('FirstVDS');
					expect(body.category).toBe('javascript');
					expect(body.hh).toEqual({
						count: 1000,
						juniorSalary: 120000,
						middleSalary: 220000,
						seniorSalary: 350000,
					});
					expect(body.advantages).toEqual([
						{
							title: 'Скорость разработки',
							description: 'Мое описание',
						},
					]);
					expect(body.seoText).toEqual('тест');
					expect(body.tagsTitle).toEqual('Полученные знания');
					expect(body.tags).toEqual(['TypeScript']);
					expect(body.createdAt).toBeDefined();
					expect(body.updatedAt).toBeDefined();
				});
		});

		it('fail - get page by alias', async () => {
			return request(app.getHttpServer()).get(`/page/byAlias/blaaaa`).expect(404, {
				statusCode: 404,
				message: PageErrorMessages.PAGE_NOT_FOUND,
			});
		});
	});

	describe('/page/textSearch/:text (GET)', () => {
		it('success - get page by text', async () => {
			return request(app.getHttpServer())
				.get(`/page/textSearch/hosting`)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body[0]._id).toBeDefined();
					expect(body[0].pageCategory).toBe(2);
					expect(body[0].subPageCategory).toBe('Облачные');
					expect(body[0].alias).toBe('hosting');
					expect(body[0].title).toBe('FirstVDS');
					expect(body[0].category).toBe('javascript');
					expect(body[0].hh).toEqual({
						count: 1000,
						juniorSalary: 120000,
						middleSalary: 220000,
						seniorSalary: 350000,
					});
					expect(body[0].advantages).toEqual([
						{
							title: 'Скорость разработки',
							description: 'Мое описание',
						},
					]);
					expect(body[0].seoText).toEqual('тест');
					expect(body[0].tagsTitle).toEqual('Полученные знания');
					expect(body[0].tags).toEqual(['TypeScript']);
					expect(body[0].createdAt).toBeDefined();
					expect(body[0].updatedAt).toBeDefined();
				});
		});

		it('fail - get page by alias', async () => {
			return request(app.getHttpServer()).get(`/page/textSearch/blaaa`).expect(404, {
				statusCode: 404,
				message: PageErrorMessages.PAGES_NOT_FOUND,
			});
		});
	});

	describe('/page/:pageId (PATCH)', () => {
		const testUpdatePageDto: UpdatePageDto = {
			seoText: 'new seo text',
		};
		it('success - update page', async () => {
			return request(app.getHttpServer())
				.patch(`/page/${pageId}`)
				.set('Authorization', 'Bearer ' + token)
				.send(testUpdatePageDto)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body.seoText).toBe('new seo text');
				});
		});

		it('fail - update page with invalid token', async () => {
			return request(app.getHttpServer())
				.patch(`/page/${pageId}`)
				.set('Authorization', 'Bearer ' + 'token')
				.expect(401, {
					statusCode: 401,
					message: 'Unauthorized',
				});
		});

		it('fail - update page with fake id', async () => {
			return request(app.getHttpServer())
				.patch(`/page/${fakeId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(404, {
					statusCode: 404,
					message: PageErrorMessages.PAGE_NOT_FOUND,
				});
		});

		it('fail - update page with invalid id', async () => {
			return request(app.getHttpServer())
				.patch(`/page/${123}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(400, {
					statusCode: 400,
					message: CommonErrorMessages.ID_VALIDATION_ERROR,
				});
		});
	});

	describe('/page/create (DELETE)', () => {
		it('success - delete page', async () => {
			return request(app.getHttpServer())
				.delete(`/page/${pageId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
		});

		it('fail - delete page with fake id', async () => {
			return request(app.getHttpServer())
				.delete(`/page/${fakeId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(404, {
					statusCode: 404,
					message: PageErrorMessages.PAGE_NOT_FOUND,
				});
		});

		it('fail - delete page with invalid id', async () => {
			return request(app.getHttpServer())
				.delete(`/page/${123}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(400, {
					statusCode: 400,
					message: CommonErrorMessages.ID_VALIDATION_ERROR,
				});
		});

		it('fail - delete page with invalid token', async () => {
			return request(app.getHttpServer())
				.delete(`/page/${pageId}`)
				.set('Authorization', 'Bearer ' + 'token')
				.expect(401, {
					statusCode: 401,
					message: 'Unauthorized',
				});
		});
	});
});
