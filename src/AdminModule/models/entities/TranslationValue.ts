export class TranslationValue {
    id?: number;

    val: string;

    locale: string;

    translation: string;

    container: string;

    constructor(
        val = "",
        locale = "",
        translation = "",
        container = "",
        id?: number
    ) {
        this.val = val;
        this.locale = locale;
        this.translation = translation;
        this.translation = translation;
        this.container = container;
        this.id = id;
    }
}
