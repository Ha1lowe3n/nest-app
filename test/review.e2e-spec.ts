import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types, disconnect } from 'mongoose';

import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { ReviewErrorMessages } from '../src/errors/errors-messages';

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
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(() => disconnect());

	it('/review/create (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testCreateDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	// !! Написать тест (POST) - fail после добавления валидации

	it('/review/byProduct/:productId (GET) - success', async () => {
		return request(app.getHttpServer())
			.get(`/review/byProduct/${productId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body).toHaveLength(1);
			});
	});

	it('/review/byProduct/:productId (GET) - fail', async () => {
		return request(app.getHttpServer()).get(`/review/byProduct/1`).expect(404, {
			statusCode: 404,
			message: ReviewErrorMessages.PRODUCT_ID_NOT_FOUND,
		});
	});

	it('/review/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.expect(200);
	});

	it('/review/:id (DELETE) - fail', () => {
		return request(app.getHttpServer()).delete('/review/1').expect(404, {
			statusCode: 404,
			message: ReviewErrorMessages.REVIEW_NOT_FOUND,
		});
	});
});
