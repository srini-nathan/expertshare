import * as yup from "yup";

const validations = {
    height: {
        min: 0,
        max: 64,
    },
    width: {
        min: 0,
        max: 64,
    },
    depth: {
        min: 0,
        max: 64,
    },
    padding: {
        min: 0,
        max: 64,
    },
    color: {
        min: 0,
        max: 64,
    },
    opacity: {
        min: 0,
        max: 64,
    },
    pX: {
        min: 0,
        max: 64,
    },
    pY: {
        min: 0,
        max: 64,
    },
    pZ: {
        min: 0,
        max: 64,
    },
    rX: {
        min: 0,
        max: 64,
    },
    rY: {
        min: 0,
        max: 64,
    },
    rZ: {
        min: 0,
        max: 64,
    },
    sX: {
        min: 0,
        max: 64,
    },
    sY: {
        min: 0,
        max: 64,
    },
    sZ: {
        min: 0,
        max: 64,
    },
    remotePosX: {
        min: 0,
        max: 64,
    },
    remotePosY: {
        min: 0,
        max: 64,
    },
    remotePosZ: {
        min: 0,
        max: 64,
    },
    remoteScaX: {
        min: 0,
        max: 64,
    },
    remoteScaY: {
        min: 0,
        max: 64,
    },
    remoteScaZ: {
        min: 0,
        max: 64,
    },
    remoteRotX: {
        min: 0,
        max: 64,
    },
    remoteRotY: {
        min: 0,
        max: 64,
    },
    remoteRotZ: {
        min: 0,
        max: 64,
    },
    textValue: {
        min: 0,
        max: 64,
    },
    textColor: {
        min: 0,
        max: 64,
    },
    textWidth: {
        min: 0,
        max: 64,
    },
    textPosX: {
        min: 0,
        max: 64,
    },
    textPosY: {
        min: 0,
        max: 64,
    },
    textPosZ: {
        min: 0,
        max: 64,
    },
    textScaX: {
        min: 0,
        max: 64,
    },
    textScaY: {
        min: 0,
        max: 64,
    },
    textScaZ: {
        min: 0,
        max: 64,
    },
    textRotX: {
        min: 0,
        max: 64,
    },
    textRotY: {
        min: 0,
        max: 64,
    },
    textRotZ: {
        min: 0,
        max: 64,
    },
    targetAction: {
        min: 0,
        max: 64,
    },
    type: {
        min: 0,
        max: 64,
    },
    targetUrl: {
        min: 0,
        max: 64,
    },
    source: {
        min: 0,
        max: 64,
    },
    transitionVideo: {
        min: 0,
        max: 64,
    },
    content: {
        min: 0,
        max: 64,
    },
    container: {
        min: 0,
        max: 64,
    },
    aFrameRoom: {
        min: 0,
        max: 64,
    },

    remoteAnimationSpeed: {
        min: 0,
        max: 64,
    },

    targetId: {
        min: 0,
        max: 64,
    },
};

const schema = yup.object().shape({
    image: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    height: yup.string().required(),
    width: yup.string().required(),
    depth: yup.string().required(),
    padding: yup.string().required(),
    color: yup.string().required(),
    opacity: yup.string().required(),
    pX: yup.string().required(),
    pY: yup.string().required(),
    pZ: yup.string().required(),
    rX: yup.string().required(),
    rY: yup.string().required(),
    rZ: yup.string().required(),
    sX: yup.string().required(),
    sY: yup.string().required(),
    sZ: yup.string().required(),
    isRemoteDisabled: yup
        .boolean()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remoteImage: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remotePosX: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remotePosY: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remotePosZ: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remoteScaX: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remoteScaY: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remoteScaZ: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remoteRotX: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remoteRotY: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remoteRotZ: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    isRemoteAnimationDisabled: yup
        .boolean()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    remoteAnimationSpeed: yup
        .number()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    isTextDisabled: yup
        .boolean()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textValue: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textColor: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textWidth: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textPosX: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textPosY: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textPosZ: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textScaX: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textScaY: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textScaZ: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textRotX: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textRotY: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    textRotZ: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    targetId: yup
        .number()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    targetUrl: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    source: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    transitionVideo: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    content: yup
        .string()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
    isTransitionEnabled: yup
        .boolean()
        .transform((currentValue, originalValue) => {
            return originalValue === "" ? null : currentValue;
        })
        .nullable(),
});

export { schema, validations };
