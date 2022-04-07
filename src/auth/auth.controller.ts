import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto): Promise<DocumentType<UserModel>> {
		return await this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto): Promise<{ access_token: string }> {
		const user = await this.authService.validateUser(dto);
		return await this.authService.login(user.email);
	}
}
