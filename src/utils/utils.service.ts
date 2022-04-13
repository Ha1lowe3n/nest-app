import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
	formatDate(date: Date): string {
		let dd = date.getDate().toString();
		if (+dd < 10) dd = '0' + dd;

		let mm = (date.getMonth() + 1).toString();
		if (+mm < 10) mm = `0${mm}`;

		let yy = (date.getFullYear() % 100).toString();
		if (+yy < 10) yy = '0' + yy;

		return dd + '.' + mm + '.' + yy;
	}
}
