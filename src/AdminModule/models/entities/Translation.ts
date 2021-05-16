export class Translation {
    id?: number | undefined;

    translationGroup: string;

    translationGroupId?: number | undefined;

    tKey: string;

    constructor(
        translationGroup = "",
        translationGroupId?: number,
        tKey = "",
        id?: number
    ) {
        this.translationGroup = translationGroup;
        this.translationGroupId = translationGroupId;
        this.tKey = tKey;
        this.id = id;
    }
}
