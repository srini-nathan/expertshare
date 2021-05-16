import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class TranslationValueApi extends EntityAPI {
    protected static POST_COLLECTION =
        ROUTES.api_translation_values_post_collection;
}
