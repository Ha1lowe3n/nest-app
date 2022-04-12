import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect, Types } from 'mongoose';

import { CommonErrorMessages, ProductErrorMessages } from '../src/errors/errors-messages';
import { MockAppModule } from './mock-app.module';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import { UpdateProductDto } from '../src/product/dto/update-product.dto';
import { FindProductDto } from '../src/product/dto/find-product.dto';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { AuthDto } from '../src/auth/dto/auth.dto';

describe('ProductController (e2e)', () => {
	let app: INestApplication;
	let productId: string;
	let token: string;

	const testCreateProductDto: CreateProductDto = {
		image: 'some image',
		title: 'some title',
		price: 500,
		oldPrice: 1000,
		credit: 50,
		description: 'some description',
		avantages: 'some advantages',
		disAvantages: 'some disAdvantages',
		categories: ['design', 'development'],
		tags: ['some tags', 'again some tags'],
		characteristics: [
			{ name: 'characteristic name 1', value: 'characteristic value 1' },
			{ name: 'characteristic name 2', value: 'characteristic value 2' },
		],
	};
	const testFindProductDto: FindProductDto = {
		category: 'design',
		limit: 5,
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

	describe('/product/create (POST)', () => {
		it('success - create new product', async () => {
			return request(app.getHttpServer())
				.post('/product/create')
				.set('Authorization', 'Bearer ' + token)
				.send(testCreateProductDto)
				.expect(201)
				.then(({ body }: request.Response) => {
					productId = body._id;
					expect(body._id).toBeDefined();
					expect(body.image).toBe(testCreateProductDto.image);
					expect(body.title).toBe(testCreateProductDto.title);
					expect(body.price).toBe(testCreateProductDto.price);
					expect(body.oldPrice).toBe(testCreateProductDto.oldPrice);
					expect(body.description).toBe(testCreateProductDto.description);
					expect(body.avantages).toBe(testCreateProductDto.avantages);
					expect(body.disAvantages).toBe(testCreateProductDto.disAvantages);
					expect(body.categories).toEqual(['design', 'development']);
					expect(body.tags).toEqual(['some tags', 'again some tags']);
					expect(body.characteristics).toEqual([
						{ name: 'characteristic name 1', value: 'characteristic value 1' },
						{ name: 'characteristic name 2', value: 'characteristic value 2' },
					]);
				});
		});
	});

	describe('/product/find (POST)', () => {
		it('success - find product with reviews, reviewsCount and reviewsAvg', async () => {
			const testCreateReviewDto: CreateReviewDto = {
				authorName: 'test 1',
				description: 'description review',
				rating: 5,
				title: 'title review',
				productId,
			};
			await request(app.getHttpServer())
				.post('/review/create')
				.send(testCreateReviewDto)
				.expect(201);
			await request(app.getHttpServer())
				.post('/review/create')
				.send({ ...testCreateReviewDto, authorName: 'test 2' })
				.expect(201);

			const { body } = await request(app.getHttpServer())
				.post('/product/find')
				.send(testFindProductDto)
				.expect(200);
			expect(body[0].reviewsCount).toBe(2);
			expect(body[0].reviews).toHaveLength(2);
			expect(body[0].reviewsAvg).toBe(5);
			expect(body[0].reviews[0].createdAt > body[0].reviews[1].createdAt).toBeTruthy();
		});
	});

	describe('/product/:id (GET)', () => {
		it('success - get product by id', async () => {
			return request(app.getHttpServer())
				.get(`/product/${productId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body._id).toBeDefined();
					expect(body.image).toBe(testCreateProductDto.image);
					expect(body.title).toBe(testCreateProductDto.title);
					expect(body.price).toBe(testCreateProductDto.price);
					expect(body.oldPrice).toBe(testCreateProductDto.oldPrice);
					expect(body.description).toBe(testCreateProductDto.description);
					expect(body.avantages).toBe(testCreateProductDto.avantages);
					expect(body.disAvantages).toBe(testCreateProductDto.disAvantages);
					expect(body.categories).toEqual(['design', 'development']);
					expect(body.tags).toEqual(['some tags', 'again some tags']);
					expect(body.characteristics).toEqual([
						{ name: 'characteristic name 1', value: 'characteristic value 1' },
						{ name: 'characteristic name 2', value: 'characteristic value 2' },
					]);
				});
		});

		it('fail - get product by fake id', async () => {
			return request(app.getHttpServer())
				.get(`/product/${fakeId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(404, {
					statusCode: 404,
					message: ProductErrorMessages.PRODUCT_NOT_FOUND,
				});
		});

		it('fail - get product by invalid id', async () => {
			return request(app.getHttpServer())
				.get(`/product/${123}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(400, {
					statusCode: 400,
					message: CommonErrorMessages.ID_VALIDATION_ERROR,
				});
		});

		it('fail - get product with invalid token', async () => {
			return request(app.getHttpServer())
				.get(`/product/${123}`)
				.set('Authorization', 'Bearer ' + 'token')
				.expect(401, {
					statusCode: 401,
					message: 'Unauthorized',
				});
		});
	});

	describe('/product/:id (PATCH)', () => {
		const updateProductDto: UpdateProductDto = {
			title: 'new title',
		};

		it('success - putch product', async () => {
			return request(app.getHttpServer())
				.patch(`/product/${productId}`)
				.set('Authorization', 'Bearer ' + token)
				.send(updateProductDto)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body.title).toBe('new title');
				});
		});

		it('fail - putch product by fake id', async () => {
			return request(app.getHttpServer())
				.patch(`/product/${fakeId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(404, {
					statusCode: 404,
					message: ProductErrorMessages.PRODUCT_NOT_FOUND,
				});
		});

		it('fail - putch product by invalid id', async () => {
			return request(app.getHttpServer())
				.patch(`/product/${123}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(400, {
					statusCode: 400,
					message: CommonErrorMessages.ID_VALIDATION_ERROR,
				});
		});

		it('fail - putch product with invalid token', async () => {
			return request(app.getHttpServer())
				.patch(`/product/${123}`)
				.set('Authorization', 'Bearer ' + 'token')
				.expect(401, {
					statusCode: 401,
					message: 'Unauthorized',
				});
		});
	});

	describe('/product/:id (DELETE)', () => {
		it('success - delete product by id', async () => {
			return request(app.getHttpServer())
				.delete(`/product/${productId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
		});

		it('fail - delete product by fake id', async () => {
			return request(app.getHttpServer())
				.delete(`/product/${fakeId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(404, {
					statusCode: 404,
					message: ProductErrorMessages.PRODUCT_NOT_FOUND,
				});
		});

		it('fail - delete product by invalid id', async () => {
			return request(app.getHttpServer())
				.patch(`/product/${123}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(400, {
					statusCode: 400,
					message: CommonErrorMessages.ID_VALIDATION_ERROR,
				});
		});

		it('fail - delete product with invalid token', async () => {
			return request(app.getHttpServer())
				.patch(`/product/${123}`)
				.set('Authorization', 'Bearer ' + 'token')
				.expect(401, {
					statusCode: 401,
					message: 'Unauthorized',
				});
		});
	});
});
