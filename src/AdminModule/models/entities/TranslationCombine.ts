import { TranslationValue } from "./TranslationValue";
import { Translation } from "./Translation";
import { TranslationGroup } from "./TranslationGroup";

export interface TranslationCombine {
    tKey: string;

    itemKey?: any;

    defaultValue: string;

    id: number;

    translation?: Translation;

    translationGroup: TranslationGroup;

    translationValues: TranslationValue[];
}
