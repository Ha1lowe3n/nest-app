import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { UtilsService } from '../utils/utils.service';
import { FileElementResponseDto } from './dto/file-element.response.dto';

@Injectable()
export class FilesService {
	constructor(private readonly utils: UtilsService) {}

	async saveFiles(files: Express.Multer.File[]): Promise<FileElementResponseDto[]> {
		const dateFolder = this.utils.formatDate(new Date());
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		await ensureDir(uploadFolder);
		const res: FileElementResponseDto[] = [];
		for (const file of files) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			res.push({ url: `${dateFolder}/${file.originalname}`, name: file.originalname });
		}
		return res;
	}
}
