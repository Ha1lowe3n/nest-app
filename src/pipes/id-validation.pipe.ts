import {
	ArgumentMetadata,
	HttpException,
	HttpStatus,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CommonErrorMessages } from '../errors/errors-messages';

@Injectable()
export class IdValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata): string {
		if (metadata.type != 'param') {
			return value;
		}
		if (!Types.ObjectId.isValid(value)) {
			throw new HttpException(
				CommonErrorMessages.ID_VALIDATION_ERROR,
				HttpStatus.BAD_REQUEST,
			);
		}
		return value;
	}
}
