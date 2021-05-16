import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class TranslationGroupApi extends EntityAPI {
    protected static POST_COLLECTION =
        ROUTES.api_translation_groups_post_collection;
}
