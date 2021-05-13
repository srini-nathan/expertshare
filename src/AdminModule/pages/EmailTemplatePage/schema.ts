import * as yup from "yup";

const validations = {
    name: {
        min: 2,
        max: 64,
    },
    locale: {
        min: 2,
        max: 16,
    },
};

const schema = yup.object().shape({
    name: yup
        .string()
        .min(validations.name.min)
        .max(validations.name.max)
        .required(),
    locale: yup
        .string()
        .min(validations.locale.min)
        .max(validations.locale.max)
        .required(),
    isActive: yup.boolean(),
});

export { schema, validations };
