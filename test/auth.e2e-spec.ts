import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect, Types } from 'mongoose';

import { AuthErrorMessages } from '../src/errors/errors-messages';
import { MockAppModule } from './mock-app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let userId: string;

	const testAuthDto: AuthDto = {
		email: 'test@test.com',
		password: '12345',
	};

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
					userId = body._id;
					expect(body.email).toBe(testAuthDto.email);
				});
		});

		it('fail - email already registered', async () => {
			return request(app.getHttpServer())
				.post('/auth/register')
				.send(testAuthDto)
				.expect(409)
				.then(({ body }: request.Response) => {
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

	describe('/auth/login (POST)', () => {
		it('success - return token to user', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send(testAuthDto)
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body.access_token).toBeDefined();
				});
		});

		it('fail - invalid email', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send({ ...testAuthDto, email: 'blabla@bla.ru' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message).toBe(AuthErrorMessages.EMAIL_NOT_FOUND);
				});
		});

		it('fail - invalid password', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send({ ...testAuthDto, password: '54321' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message).toBe(AuthErrorMessages.PASSWORD_FAILED);
				});
		});

		it('fail - validate error: invalid email', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send({ ...testAuthDto, email: 'email' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.EMAIL_NOT_VALID);
				});
		});

		it('fail - validate error: password too short', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send({ ...testAuthDto, password: '1' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.PASSWORD_LONG);
				});
		});

		it('fail - validate error: password too long', async () => {
			return request(app.getHttpServer())
				.post('/auth/login')
				.send({ ...testAuthDto, password: '1234567890123456789012345678901234567890' })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(AuthErrorMessages.PASSWORD_LONG);
				});
		});
	});

	describe('/auth/delete/:id (DELETE)', () => {
		it('success - delete user', async () => {
			return request(app.getHttpServer()).delete(`/auth/delete/${userId}`).expect(200);
		});

		it('fail - delete nonexistent user', async () => {
			const fakeId = new Types.ObjectId().toHexString();
			return request(app.getHttpServer())
				.delete(`/auth/delete/${fakeId}`)
				.expect(404, { statusCode: 404, message: AuthErrorMessages.USER_NOT_FOUND });
		});
	});
});
