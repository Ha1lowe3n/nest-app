import {
	Body,
	Controller,
	HttpCode,
	HttpException,
	HttpStatus,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { AuthErrorMessages } from '../errors/errors-messages';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto): Promise<DocumentType<UserModel>> {
		const findUser = await this.authService.findUser(dto.email);
		if (findUser) {
			throw new HttpException(
				AuthErrorMessages.EMAIL_ALREADY_REGISTERED,
				HttpStatus.CONFLICT,
			);
		}
		return await this.authService.createUser(dto);
	}

	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto): Promise<AuthDto> {
		return dto;
	}
}
