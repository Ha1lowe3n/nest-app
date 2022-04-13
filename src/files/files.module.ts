import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { UtilsService } from '../utils/utils.service';

@Module({
	controllers: [FilesController],
	providers: [FilesService, UtilsService],
})
export class FilesModule {}
