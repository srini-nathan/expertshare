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
    isAuth2wayEnable: boolean;
    auth2wayRole: string[];
    isQuestionBoardEnable: boolean;
<<<<<<< HEAD
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
<<<<<<< HEAD
    isDisclaimerEnable: boolean;
    isLoginGoogleEnable: boolean;
    isLoginLinkedinEnable: boolean;
    isLoginAzureEnable: boolean;
    isOnboardingEnable: boolean;
    filterUserRoles: string[];
=======
=======
>>>>>>> 56c8c439 (feat: made live now dynamic)
=======
    isPipEnable: boolean;
>>>>>>> 2ca0644f (Fix: PIP enable based on container settings)
>>>>>>> 895967da55bc920a0cbee85f7b7a1fd0087cce42
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

    isAuth2wayEnable = false;

    auth2wayRole = [""];

    isQuestionBoardEnable = false;

<<<<<<< HEAD
    isLiveNowEnable = false;
<<<<<<< HEAD

    isPipEnable = false;

    shortDate = "EEEE MMMM, dd";

    longDate = "EEEE MMMM, dd";

    shortTime = "hh:mm a";

    longTime = "hh:mm a";

    shortDatetime = "EEEE MMMM, dd hh:mm a";

    longDatetime = "EEEE MMMM, dd hh:mm a";
<<<<<<< HEAD

    isDisclaimerEnable = false;

    isLoginGoogleEnable = false;

    isLoginLinkedinEnable = false;

    isLoginAzureEnable = false;

    isOnboardingEnable = false;

    filterUserRoles = [""];
=======
=======
>>>>>>> 56c8c439 (feat: made live now dynamic)
=======
    isPipEnable = false;
>>>>>>> 2ca0644f (Fix: PIP enable based on container settings)
>>>>>>> 895967da55bc920a0cbee85f7b7a1fd0087cce42
}

export const useDefaultOnEmpty = [
    "shortDate",
    "longDate",
    "shortTime",
    "longTime",
    "shortDatetime",
    "longDatetime",
];
