import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class TranslationGroupApi extends EntityAPI {
    protected static POST_COLLECTION =
        ROUTES.api_translation_groups_post_collection;

    protected static PATCH_ITEM = ROUTES.api_translation_groups_patch_item;

    protected static DELETE_ITEM = ROUTES.api_translation_groups_delete_item;
}
