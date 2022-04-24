import {
	BadRequestException,
	Controller,
	HttpCode,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponseDto } from './dto/file-element.response.dto';
import { FilesService } from './files.service';
import { MFile } from './MFile.class';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@HttpCode(200)
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(FileInterceptor('files'))
	async uploadFiles(
		@UploadedFile() file: Express.Multer.File,
	): Promise<FileElementResponseDto[]> {
		if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
			const saveArray: MFile[] = [new MFile(file)];

			if (!file.mimetype.match(/\/(webp)$/)) {
				const buffer = await this.filesService.convertFile(file.buffer);
				saveArray.push({
					originalname: `$${file.originalname.split('.')[0]}.webp`,
					buffer,
				});
			}
			return await this.filesService.saveFiles(saveArray);
		} else {
			throw new BadRequestException('Недопустимый формат файла');
		}
	}
}
