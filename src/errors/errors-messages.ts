export const CommonErrorMessages = {
	ID_VALIDATION_ERROR: 'Неверный формат ID',
	UNAUTHORIZED: 'Вы не авторизованы',
};

export const ReviewErrorMessages = {
	REVIEW_NOT_FOUND: 'Не удалось найти отзыв',
	PRODUCT_ID_NOT_FOUND: 'Неверно введен productId',
	AUTHOR_NAME_LONG: 'Имя автора должно быть от 2 до 20 символов',
	DESCRIPTION_LONG: 'Описание должно быть от 10 до 200 символов',
	RATING_COUNT: 'Рейтинг должен быть от 1 до 5',
};

export const AuthErrorMessages = {
	PASSWORD_LONG: 'Пароль должен быть от 5 до 30 символов',
	EMAIL_NOT_VALID: 'Неверно указан email',
	EMAIL_ALREADY_REGISTERED: 'Такой email уже зарегистрирован',
	EMAIL_NOT_FOUND: 'Пользователь с таким email не зарегистрирован',
	PASSWORD_FAILED: 'Неверный пароль',
	USER_NOT_FOUND: 'Пользователь не найден',
};

export const ProductErrorMessages = {
	PRODUCT_NOT_FOUND: 'Продукт не найден',
};

export const PageErrorMessages = {
	PAGE_NOT_FOUND: 'Страница не найдена',
	PAGES_NOT_FOUND: 'Страницы не найдены',
};
