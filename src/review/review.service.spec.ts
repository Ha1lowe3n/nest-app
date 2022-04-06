import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
	let service: ReviewService;

	const id = new Types.ObjectId().toHexString();
	const reviewRepositoryFactory = () => ({
		find: jest.fn().mockReturnValue([{ productId: id }]),
	});
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{ provide: getModelToken('ReviewModel'), useFactory: reviewRepositoryFactory },
			],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('service defined', () => {
		expect(service).toBeDefined();
	});

	it('findByProductId working', async () => {
		const res = await service.findByProductId(id);
		expect(res[0].productId).toBe(id);
	});
});
