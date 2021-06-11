import * as yup from "yup";

const schema = yup.object().shape({
    isVisible: yup.boolean(),
    streamType: yup.string().default("YOUTUBE"),
    isExternalLinkEnable: yup.boolean(),
    sessionCategory: yup.string().required(),
    cardSize: yup.string().required(),
    cardType: yup.string().required(),
    ord: yup.number().nullable(),
    streamUrlYoutube: yup.string().when("streamType", {
        is: "YOUTUBE",
        then: yup.string().required(),
    }),
    streamUrlDacast: yup.string().when("streamType", {
        is: "DACAST",
        then: yup.string().required(),
    }),

    streamUrlVimeo: yup.string().when("streamType", {
        is: "VIMEO",
        then: yup.string().required(),
    }),
    streamUrlSwisscom: yup.string().when("streamType", {
        is: "SWISSCOM",
        then: yup.string().required(),
    }),
    streamUrlKnovio: yup.string().when("streamType", {
        is: "KNOVIO",
        then: yup.string().required(),
    }),

    zoomurl: yup
        .string()
        .when("streamType", {
            is: "ZOOM",
            then: yup.string().required(),
        })
        .nullable(),

    externalLinkLabel: yup.string().when("isExternalLinkEnable", {
        is: true,
        then: yup.string().required(),
    }),

    externalLinkUrl: yup.string().when("isExternalLinkEnable", {
        is: true,
        then: yup.string().required(),
    }),

    zoomMeetingNumber: yup.string().when("streamType", {
        is: "ZOOM",
        then: yup.string().required(),
    }),
    zoomMeetingPassword: yup.string().when("streamType", {
        is: "ZOOM",
        then: yup.string().required(),
    }),
    webexUrl: yup.string().when("streamType", {
        is: "WEBEX",
        then: yup.string().required(),
    }),
    webexMeetingPassword: yup.string().when("streamType", {
        is: "WEBEX",
        then: yup.string().required(),
    }),
});

export { schema };
