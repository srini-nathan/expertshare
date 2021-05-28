import * as yup from "yup";
import { CONSTANTS } from "../../../config";

const { UserField } = CONSTANTS;
const { FIELDTYPE } = UserField;

const validations = {
    name: {
        max: 255,
    },
    fieldKey: {
        max: 64,
    },
    labelKey: {
        max: 255,
    },
};

const schema = yup.object().shape({
    name: yup.string().max(validations.name.max).required(),
    fieldKey: yup.string().max(validations.fieldKey.max).required(),
    labelKey: yup.string().max(validations.labelKey.max).required(),
    fieldType: yup.string().required(),
    attr: yup.array().optional().nullable(),
    options: yup.array().when("fieldType", {
        is:
            FIELDTYPE.FIELDTYPE_SELECT ||
            FIELDTYPE.FIELDTYPE_MULTI_SELECT ||
            FIELDTYPE.FIELDTYPE_RADIO_GROUP ||
            FIELDTYPE.FIELDTYPE_CHECKBOX_GROUP,
        then: yup
            .array()
            .of(
                yup.object().shape({
                    key: yup.string().trim().required("option key is required"),
                    value: yup
                        .string()
                        .trim()
                        .required("option value is required"),
                })
            )
            .min(1, "Minimum of 1 option"),
    }),
});

export { schema, validations };
