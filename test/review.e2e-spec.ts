import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types, disconnect } from 'mongoose';

import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { ReviewErrorMessages } from '../src/errors/errors-messages';
import { MockAppModule } from './mock-app.module';

const productId = new Types.ObjectId().toHexString();
const testCreateDto: CreateReviewDto = {
	authorName: 'name author',
	description: 'description review',
	rating: 5,
	title: 'title review',
	productId,
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MockAppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(() => disconnect());

	describe('/review/create (POST)', () => {
		it('success - create review', async () => {
			return request(app.getHttpServer())
				.post('/review/create')
				.send(testCreateDto)
				.expect(201)
				.then(({ body }: request.Response) => {
					createdId = body._id;
					expect(createdId).toBeDefined();
				});
		});

		it('fail - validation error: author name too short', async () => {
			return request(app.getHttpServer())
				.post('/review/create')
				.send({ ...testCreateDto, authorName: 'a' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ReviewErrorMessages.AUTHOR_NAME_LONG);
				});
		});

		it('fail - validation error: author name too long', async () => {
			return request(app.getHttpServer())
				.post('/review/create')
				.send({ ...testCreateDto, authorName: 'afghgfhgfhfghdfghdfhdgfhdgfhghfg' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ReviewErrorMessages.AUTHOR_NAME_LONG);
				});
		});

		it('fail - validation error: description too short', async () => {
			return request(app.getHttpServer())
				.post('/review/create')
				.send({ ...testCreateDto, description: 'a' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ReviewErrorMessages.DESCRIPTION_LONG);
				});
		});

		it('fail - validation error: description too long', async () => {
			return request(app.getHttpServer())
				.post('/review/create')
				.send({
					...testCreateDto,
					description:
						'авпавпвапавпавпавпвапвапававва' +
						'вапвапваппарпарвпараправпавпва' +
						'павпавпавпвапвапававвавапвапва' +
						'ппарпарвпараправпавпвапавпавпа' +
						'впвапвапававвавапвапваппарпарв' +
						'параправпавпвапавпавпавпвапвапававвавапвапваппарпарвпарапр',
				})
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ReviewErrorMessages.DESCRIPTION_LONG);
				});
		});

		it('fail - validation error: rating count less than 1', async () => {
			return request(app.getHttpServer())
				.post('/review/create')
				.send({ ...testCreateDto, rating: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ReviewErrorMessages.RATING_COUNT);
				});
		});

		it('fail - validation error: rating count less than 1', async () => {
			return request(app.getHttpServer())
				.post('/review/create')
				.send({ ...testCreateDto, rating: 6 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(ReviewErrorMessages.RATING_COUNT);
				});
		});
	});

	describe('/review/byProduct/:productId (GET)', () => {
		it('success', async () => {
			return request(app.getHttpServer())
				.get(`/review/byProduct/${productId}`)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body).toHaveLength(1);
				});
		});

		it('fail', async () => {
			return request(app.getHttpServer()).get(`/review/byProduct/1`).expect(404, {
				statusCode: 404,
				message: ReviewErrorMessages.PRODUCT_ID_NOT_FOUND,
			});
		});
	});

	describe('/review/:id (DELETE)', () => {
		it('success', () => {
			return request(app.getHttpServer())
				.delete('/review/' + createdId)
				.expect(200);
		});

		it('fail', () => {
			return request(app.getHttpServer()).delete('/review/1').expect(404, {
				statusCode: 404,
				message: ReviewErrorMessages.REVIEW_NOT_FOUND,
			});
		});
	});
});
