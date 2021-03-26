import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class LanguageApi extends EntityAPI {
    protected static PATH = "/api/languages";
}
