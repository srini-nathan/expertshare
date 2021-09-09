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
}
