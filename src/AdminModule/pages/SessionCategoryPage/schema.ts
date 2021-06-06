import * as yup from "yup";

const validations = {
    name: {
        min: 2,
        max: 64,
    },
    color: {
        match: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
        message: "Only support valid HEX color code",
    },
};

const schema = yup.object().shape({
    name: yup
        .string()
        .min(validations.name.min)
        .max(validations.name.max)
        .required(),
    color: yup
        .string()
        .matches(validations.color.match, {
            message: validations.color.message,
        })
        .required(),
});

export { schema, validations };
