import { BaseEntity } from "../../../AppModule/models";
import { Package } from "./Package";

export interface Container extends BaseEntity {
    name: string;
    notes: string;
    packages: Package[];
}
