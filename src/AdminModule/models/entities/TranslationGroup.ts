export class TranslationGroup {
    id?: number;

    name: string;

    tgKey: string;

    constructor(name = "", tgKey = "", id?: number) {
        this.name = name;
        this.tgKey = tgKey;
        this.id = id;
    }
}
