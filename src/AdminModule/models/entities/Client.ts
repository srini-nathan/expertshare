import { BaseEntity } from "../../../AppModule/models";
import { Package } from "./Package";

export interface Client extends BaseEntity {
    name: string;
    notes: string;
    packages: Package[];
}
