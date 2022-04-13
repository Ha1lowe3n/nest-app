import {
	Controller,
	HttpCode,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UtilsService } from '../utils/utils.service';
import { FileElementResponseDto } from './dto/file-element.response.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
	constructor(
		private readonly filesService: FilesService,
		private readonly utils: UtilsService,
	) {}

	@Post('upload')
	@HttpCode(200)
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(FileInterceptor('files'))
	async uploadFiles(
		@UploadedFile() file: Express.Multer.File,
	): Promise<FileElementResponseDto[]> {
		return await this.filesService.saveFiles([file]);
	}
}
