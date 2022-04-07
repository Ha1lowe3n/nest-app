import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect } from 'mongoose';

import { AuthErrorMessages } from '../src/errors/errors-messages';
import { MockAppModule } from './mock-app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';

const testAuthDto: AuthDto = {
	email: 'test@test.com',
	password: '12345',
};

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MockAppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(() => disconnect());

	describe('/auth/register (POST)', () => {
		it('success - create new user', async () => {
			return request(app.getHttpServer())
				.post('/auth/register')
				.send(testAuthDto)
				.expect(201)
				.then(({ body }: request.Response) => {
					expect(body.email).toBe(testAuthDto.email);
				});
		});

		it('fail - email already registered', async () => {
			return request(app.getHttpServer())
				.post('/auth/register')
				.send(testAuthDto)
				.expect(409)
				.then(({ body }: request.Response) => {
					console.log(body);
					expect(body.message).toBe(AuthErrorMessages.EMAIL_ALREADY_REGISTERED);
				});
		});

		it('fail - validate error: invalid email', async () => {
			return request(app.getHttpServer())
				.post('/auth/register')
				.send({ ...testAuthDto, email: 'email' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.EMAIL_NOT_VALID);
				});
		});

		it('fail - validate error: password too short', async () => {
			return request(app.getHttpServer())
				.post('/auth/register')
				.send({ ...testAuthDto, password: '1' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.PASSWORD_LONG);
				});
		});

		it('fail - validate error: password too long', async () => {
			return request(app.getHttpServer())
				.post('/auth/register')
				.send({ ...testAuthDto, password: '1234567890123456789012345678901234567890' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.PASSWORD_LONG);
				});
		});
	});
});
