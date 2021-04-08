import { BaseEntity } from "../../../AppModule/models";

export interface Language extends BaseEntity {
    name: string;
    locale: string;
    isActive: boolean;
    isDefault: boolean;
    container: string;
}
