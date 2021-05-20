import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

const {
    api_translation_groups_post_collection: API_TRANSLATION_GROUPS_POST_COLLECTION,
    api_translation_groups_patch_item: API_TRANSLATION_GROUPS_PATCH_COLLECTION,
    api_translation_groups_delete_item: API_TRANSLATION_GROUPS_DELETE_COLLECTION,
} = ROUTES;

export abstract class TranslationGroupApi extends EntityAPI {
    protected static POST_COLLECTION = API_TRANSLATION_GROUPS_POST_COLLECTION;

    protected static PATCH_ITEM = API_TRANSLATION_GROUPS_PATCH_COLLECTION;

    protected static DELETE_ITEM = API_TRANSLATION_GROUPS_DELETE_COLLECTION;
}
