import { findPercent } from "./findScreenWidthPercent";

const CHAT_WIDTH = 364;
const COLLAPSED_CHAT_WIDTH = 250;
const PADDING = 20;

export const getChatsWidth = (chatsCount: number, screenWidth: number) => {
    return {
        accessScreenWidth:
            screenWidth - (screenWidth / 100) * findPercent(screenWidth),
        chatsWidth: CHAT_WIDTH * (chatsCount + 1) + PADDING * (chatsCount + 3),
        collapseChatsWidth:
            COLLAPSED_CHAT_WIDTH * (chatsCount - 1) +
            CHAT_WIDTH * 2 +
            PADDING * (chatsCount + 3),
    };
};
