export interface Configuration {
    isChatEnable: boolean;
    isA3dEnable: boolean;
    isHubspotEnable: boolean;
    googleAnalyticsCode: string;
    hubspotId: string;
    projectName: string;
    isMusicEnable: boolean;
    isMusicLoop: boolean;
    musicFilename: string;
    isQuestionBoardEnable: boolean;
    isLiveNowEnable: boolean;
<<<<<<< HEAD
    isPipEnable: boolean;
    excludeDomainsFromAnalytics: string;
    shortDate: string;
    longDate: string;
    shortTime: string;
    longTime: string;
    longDatetime: string;
    shortDatetime: string;
=======
>>>>>>> 56c8c439 (feat: made live now dynamic)
}

export class Configuration implements Configuration {
    isChatEnable = false;

    isA3dEnable = false;

    isHubspotEnable = false;

    googleAnalyticsCode = "";

    hubspotId = "";

    projectName = "";

    isMusicEnable = false;

    isMusicLoop = false;

    musicFilename = "";

    isQuestionBoardEnable = false;

    isLiveNowEnable = false;
<<<<<<< HEAD

    isPipEnable = false;

    shortDate = "EEEE MMMM, dd";

    longDate = "EEEE MMMM, dd";

    shortTime = "hh:mm a";

    longTime = "hh:mm a";

    shortDatetime = "EEEE MMMM, dd hh:mm a";

    longDatetime = "EEEE MMMM, dd hh:mm a";
=======
>>>>>>> 56c8c439 (feat: made live now dynamic)
}

export const useDefaultOnEmpty = [
    "shortDate",
    "longDate",
    "shortTime",
    "longTime",
    "shortDatetime",
    "longDatetime",
];
