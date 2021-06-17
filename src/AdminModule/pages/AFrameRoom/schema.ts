import * as yup from "yup";

const validations = {
    name: {
        min: 2,
        max: 64,
    },
    camPosX: {
        min: 1,
        max: 64,
    },
    camPosY: {
        min: 1,
        max: 64,
    },
    camPosZ: {
        min: 1,
        max: 64,
    },
    camRotX: {
        min: 1,
        max: 64,
    },
    camRotY: {
        min: 1,
        max: 64,
    },
    camRotZ: {
        min: 1,
        max: 64,
    },
};

const schema = yup.object().shape({
    name: yup
        .string()
        .min(validations.name.min)
        .max(validations.name.max)
        .required(),
    camPosX: yup
        .string()
        .min(validations.camPosX.min)
        .max(validations.camPosX.max)
        .required(),
    camPosY: yup
        .string()
        .min(validations.camPosY.min)
        .max(validations.camPosY.max)
        .required(),
    camPosZ: yup
        .string()
        .min(validations.camPosZ.min)
        .max(validations.camPosZ.max)
        .required(),
    camRotX: yup
        .string()
        .min(validations.camRotX.min)
        .max(validations.camRotX.max)
        .required(),
    camRotY: yup
        .string()
        .min(validations.camRotY.min)
        .max(validations.camRotY.max)
        .required(),
    camRotZ: yup
        .string()
        .min(validations.camRotZ.min)
        .max(validations.camRotZ.max)
        .required(),
    isEntryRoom: yup.boolean(),
});

export { schema, validations };
