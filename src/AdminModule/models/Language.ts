import { BaseEntity } from "../../AppModule/models";

export interface Language extends BaseEntity {
    locale: string;
    name: string;
}
