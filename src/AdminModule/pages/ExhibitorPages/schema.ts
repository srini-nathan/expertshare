import * as yup from "yup";

const validations = {
    name: {
        min: 2,
        max: 64,
    },
};

const schema = yup.object().shape({
    category: yup.string().required(),
    isVisible: yup.boolean().nullable(),
    isExternal: yup.boolean().nullable(),
    externalUrl: yup.string().when("isExternal", {
        is: true,
        then: yup.string().url().required(),
    }),
    streamType: yup.string().nullable(),
    streamUrl: yup
        .string()
        .when("streamType", {
            is: (val: string) => val !== "FILE",
            then: yup.string().url(),
        })
        .nullable(),
});

const productSchema = yup.object().shape({
    price: yup.string(),
    isCta: yup.boolean().nullable(),
    ctaUrl: yup.string().when("isCta", {
        is: true,
        then: yup.string().url().required(),
    }),
});

export { schema, validations, productSchema };
