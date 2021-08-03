import ROUTES from "./routes.json";
import CONSTANTS from "./constants.json";
import { FileTypeInfo, SimpleObject } from "../AppModule/models";

export * from "./helper";

const R = ROUTES;
const C = CONSTANTS;
const { Upload, VoteQuestion } = CONSTANTS;

const {
  VOTEQUESTIONTYPE: VOTE_QUESTION_TYPE,
  VOTEQUESTIONCHARTTYPE: VOTE_QUESTION_CHART_TYPE
} = VoteQuestion;

const {
  FILETYPE: FILE_TYPE,
  FILETYPEINFO: FILE_TYPE_INFO
} = Upload;

// @TODO: Remove hard-coded
const FILETYPEINFO_VOTEOPTION_MEDIA = {
  "key": "VOTEOPTION_MEDIA",
  "width": null,
  "height": null,
  "ratio": null,
  "maxSize": 32,
  "allowType": [],
  "isSecure": false,
  "path": "voteoption_media"
};
// @TODO: Remove hard-coded
const FILETYPE_VOTEOPTION_MEDIA  = "voteoption_media";
const VoteOptionFileInfo = FILETYPEINFO_VOTEOPTION_MEDIA as FileTypeInfo;
const VOTE_OPTION_MEDIA_TYPE = FILETYPE_VOTEOPTION_MEDIA;

export {
  R,
  ROUTES,
  CONSTANTS,
  C,
  FILE_TYPE,
  FILE_TYPE_INFO,
  VOTE_QUESTION_TYPE,
  VOTE_QUESTION_CHART_TYPE,
  VOTE_OPTION_MEDIA_TYPE,
  VoteOptionFileInfo,
};
