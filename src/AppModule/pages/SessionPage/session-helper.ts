import { CONSTANTS } from "../../../config";

const {
    Session: { CARDTYPE, CARDSIZE },
} = CONSTANTS;

export const cardSizeOptions = Object.entries(CARDSIZE).map(([, value]) => ({
    value,
    label: value,
}));

export const cardTypeOptions = Object.entries(CARDTYPE).map(([, value]) => ({
    value,
    label: value,
}));
