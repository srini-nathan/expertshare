import * as yup from "yup";

const validations = {
    name: {
        max: 255,
    },
};

const schema = yup.object().shape({
    name: yup.string().required().max(validations.name.max),
    description: yup.string(),
    providerUrl: yup.string().url().required(),
});

export { schema, validations };
