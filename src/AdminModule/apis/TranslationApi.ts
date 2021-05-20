import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

const {
    api_translations_post_collection: API_TRANSLATION_POST_COLLECTION,
    api_translations_get_combine_collection: API_TRANSLATION_GET_COMBINE_COLLECTION,
    api_translations_delete_item: API_TRANSLATION_DELETE_COLLECTION,
    api_translations_patch_item: API_TRANSLATION_PATCH_COLLECTION,
    api_translations_get_item: API_TRANSLATION_GET_ITEM_COLLECTION,
} = ROUTES;

export abstract class TranslationApi extends EntityAPI {
    protected static POST_COLLECTION = API_TRANSLATION_POST_COLLECTION;

    protected static GET_ITEM = API_TRANSLATION_GET_ITEM_COLLECTION;

    protected static GET_COLLECTION = API_TRANSLATION_GET_COMBINE_COLLECTION;

    protected static DELETE_ITEM = API_TRANSLATION_DELETE_COLLECTION;

    protected static PATCH_ITEM = API_TRANSLATION_PATCH_COLLECTION;
}
