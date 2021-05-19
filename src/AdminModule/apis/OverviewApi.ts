import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class ContainerOverviewApi extends EntityAPI {
    protected static GET_COLLECTION = "/api/containers/overview";
}
