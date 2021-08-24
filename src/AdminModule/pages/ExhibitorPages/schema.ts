import * as yup from "yup";

const validations = {
    name: {
        min: 2,
        max: 64,
    },
};

const schema = yup.object().shape({
    category: yup.string().required(),
    isExternal: yup.boolean(),
    externalUrl: yup.string().when("isExternal", {
        is: true,
        then: yup.string().url().required(),
    }),
    streamType: yup.string(),
    streamUrl: yup.string().when("streamType", {
        is: (val: string) => val !== "FILE",
        then: yup.string().url(),
    }),
});

export { schema, validations };
