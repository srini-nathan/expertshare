import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class PackageApi extends EntityAPI {
    protected static PATH = "/api/packages";
}
