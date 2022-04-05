export class ProductModel {
	image: string;
	title: string;
	price: number;
	oldPrice: number;
	credit: number;
	calculateRating: number;
	description: string;
	avantages: string;
	disAvantages: string;
	categories: string[];
	characeristics: {
		[key: string]: string;
	};
}
