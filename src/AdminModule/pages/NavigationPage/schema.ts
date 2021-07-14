import * as yup from "yup";

const validations = {
    key: {
        min: 2,
        max: 16,
    },
    title: {
        min: 2,
        max: 16,
    },
};

const schema = yup.object().shape({
    isActive: yup.boolean(),
    type: yup.string().required(),
    ord: yup.number().required(),
    icon: yup.string().required(),
    url: yup.string().required(),
    isOpenInNewWindow: yup.boolean(),
});

export { schema, validations };
