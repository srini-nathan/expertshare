export class TranslationGroup {
    id?: number | undefined;

    name: string;

    tgKey: string;

    constructor(name = "", tgKey = "", id?: number) {
        this.name = name;
        this.tgKey = tgKey;
        this.id = id;
    }
}
