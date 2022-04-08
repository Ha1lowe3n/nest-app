import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { compare, hash } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { AuthErrorMessages } from '../errors/errors-messages';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser({ email, password }: AuthDto): Promise<DocumentType<UserModel>> {
		const findUser = await this.userModel.findOne({ email });
		if (findUser) {
			throw new HttpException(
				AuthErrorMessages.EMAIL_ALREADY_REGISTERED,
				HttpStatus.CONFLICT,
			);
		}

		const passwordHash = await hash(password, 10);
		const newUser = new this.userModel({ email, passwordHash });
		return await newUser.save();
	}

	async validateUser({ email, password }: AuthDto): Promise<Pick<UserModel, 'email'> | null> {
		const user = await this.userModel.findOne({ email });
		if (!user) {
			throw new HttpException(AuthErrorMessages.EMAIL_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}
		const validatePassword = await compare(password, user.passwordHash);
		if (!validatePassword) {
			throw new HttpException(AuthErrorMessages.PASSWORD_FAILED, HttpStatus.BAD_REQUEST);
		}
		return { email: user.email };
	}

	async login(email: string): Promise<{ access_token: string }> {
		const payload = { email };
		return { access_token: await this.jwtService.signAsync(payload) };
	}

	async delete(id: string): Promise<DocumentType<UserModel>> {
		const deletedUser = await this.userModel.findByIdAndDelete(id);
		if (!deletedUser) {
			throw new HttpException(AuthErrorMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedUser;
	}
}
