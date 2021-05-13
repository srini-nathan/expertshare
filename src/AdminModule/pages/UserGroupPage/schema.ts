import * as yup from "yup";

const validations = {
    name: {
        max: 255,
    },
};

const schema = yup.object().shape({
    name: yup.string().max(validations.name.max).required(),
});

export { schema, validations };
