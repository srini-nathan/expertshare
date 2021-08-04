export interface Configuration {
    isChatEnable: boolean;
    isA3dEnable: boolean;
}

export class Configuration implements Configuration {
    isChatEnable = false;

    isA3dEnable = false;
}
