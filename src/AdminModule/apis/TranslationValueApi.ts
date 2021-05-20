import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

const {
    api_translation_values_post_collection: API_TRANSLATION_VALUES_POST_COLLECTION,
    api_translation_values_patch_item: API_TRANSLATION_VALUES_PATCH_COLLECTION,
} = ROUTES;

export abstract class TranslationValueApi extends EntityAPI {
    protected static POST_COLLECTION = API_TRANSLATION_VALUES_POST_COLLECTION;

    protected static PATCH_ITEM = API_TRANSLATION_VALUES_PATCH_COLLECTION;
}
