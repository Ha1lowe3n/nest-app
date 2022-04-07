import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { hash } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';

@Injectable()
export class AuthService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async createUser(dto: AuthDto): Promise<DocumentType<UserModel>> {
		const passwordHash = await hash(dto.password, 10);
		const newUser = new this.userModel({
			email: dto.email,
			passwordHash,
		});
		return await newUser.save();
	}

	async findUser(email: string): Promise<DocumentType<UserModel> | null> {
		try {
			return await this.userModel.findOne({ email });
		} catch (error) {
			return null;
		}
	}
}
