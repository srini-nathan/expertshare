export class Translation {
    id?: number | null;

    translationGroup: string;

    translationGroupId?: number | undefined;

    tKey?: string;

    defaultValue?: string;

    itemKey?: any;

    items?: any;

    constructor(
        translationGroup = "",
        translationGroupId?: number,
        tKey = "",
        items = null,
        defaultValue = "",
        id?: number | null
    ) {
        this.translationGroup = translationGroup;
        this.translationGroupId = translationGroupId;
        this.tKey = tKey;
        this.defaultValue = defaultValue;
        this.id = id;
        this.items = items;
    }
}
