export const REPLACEABLE_FIELD_NAME = '{fieldName}';

/*
 * -------------------------------------------
 *        RegExps
 * -------------------------------------------
 */

export const emailRegExp = new RegExp(
    /^[а-яА-ЯёЁa-zA-Z!#$%&'*+=?^_`{|}~\\-]{1}([а-яА-ЯёЁa-zA-Z0-9!#$%&'*+=?^_`{|}~\\-]*[.]?)*[а-яА-ЯёЁa-zA-Z0-9!#$%&'*+=?^_`{|}~\\]{1}[@]{1}([а-яА-ЯёЁa-zA-Z]{1}[а-яА-ЯёЁa-zA-Z0-9-]*[.]{1,})+[а-яА-ЯёЁa-zA-Z]{1,}[0-9]*$/,
);
export const textEngRegExp = new RegExp(/^[A-Za-z]+$/);
export const textRusRealNameRegExp = new RegExp(/^[а-яА-ЯёЁ]+$/);
export const textRusRealSurnameRegExp = new RegExp(/^[а-яА-ЯёЁ-]+$/);