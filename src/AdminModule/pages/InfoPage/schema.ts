import * as yup from "yup";

const validations = {
    slugKey: {
        min: 2,
        max: 64,
    },
    title: {
        min: 2,
        max: 16,
    },
};

const schema = yup.object().shape({
    slugKey: yup
        .string()
        .min(validations.slugKey.min)
        .max(validations.slugKey.max)
        .required(),
    isActive: yup.boolean(),
});

export { schema, validations };
