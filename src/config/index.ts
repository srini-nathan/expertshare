// noinspection SpellCheckingInspection

import ROUTES from "./routes.json";
import CONSTANTS from "./constants.json";
import { FileTypeInfo } from "../AppModule/models";

export * from "./helper";

const R = ROUTES;
const C = CONSTANTS;
const { Upload, VoteQuestion, Role, Session } = CONSTANTS;

const {
  FILETYPE: FILE_TYPE,
  FILETYPEINFO: FILE_TYPE_INFO,
} = Upload;

const {
  VOTEQUESTIONTYPE: VOTE_QUESTION_TYPE,
  VOTEQUESTIONCHARTTYPE: VOTE_QUESTION_CHART_TYPE
} = VoteQuestion;

const {
  STREAMTYPE: STREAM_TYPE,
  CARDSIZE: CARD_SIZE,
  CARDTYPE: CARD_TYPE
} = Session;

// FileTypeInfo definations
const { FILETYPEINFO_VOTEOPTION_POSTER, FILETYPEINFO_USER_PROFILE, FILETYPEINFO_EXHIBITOR_POSTER, FILETYPEINFO_EXHIBITORLOGO_POSTER, FILETYPEINFO_EXHIBITORVIDEO_MEDIA, FILETYPEINFO_EXHIBITORPRODUCT_POSTER, FILETYPEINFO_CONFERENCE_POSTER } = FILE_TYPE_INFO;
const VoteOptionFileInfo = FILETYPEINFO_VOTEOPTION_POSTER as FileTypeInfo;
const UserProfileFileInfo = FILETYPEINFO_USER_PROFILE as FileTypeInfo;
const ExhibitorPosterFileInfo = FILETYPEINFO_EXHIBITOR_POSTER as FileTypeInfo;
const ExhibitorLogoPosterFileInfo = FILETYPEINFO_EXHIBITORLOGO_POSTER as FileTypeInfo;
const ExhibitorVideoFileInfo = FILETYPEINFO_EXHIBITORVIDEO_MEDIA as FileTypeInfo;
const ExhibitorProductPosterFileInfo = FILETYPEINFO_EXHIBITORPRODUCT_POSTER as FileTypeInfo;
const ConferencePosterFileInfo = FILETYPEINFO_CONFERENCE_POSTER as FileTypeInfo;

// UploadImage types
const { FILETYPE_VOTEOPTION_POSTER, FILETYPE_EXHIBITOR_POSTER, FILETYPE_EXHIBITORLOGO_POSTER, FILETYPE_USER_PROFILE, FILETYPE_EXHIBITORVIDEO_MEDIA, FILETYPE_EXHIBITORPRODUCT_POSTER, FILETYPE_CONFERENCE_POSTER } = FILE_TYPE;
const VOTE_OPTION_POSTER_TYPE = FILETYPE_VOTEOPTION_POSTER;
const EXHIBITOR_POSTER_TYPE = FILETYPE_EXHIBITOR_POSTER;
const EXHIBITOR_LOGO_POSTER_TYPE = FILETYPE_EXHIBITORLOGO_POSTER;
const EXHIBITOR_VIDEO_TYPE = FILETYPE_EXHIBITORVIDEO_MEDIA;
const USER_PROFILE_TYPE = FILETYPE_USER_PROFILE;
const EXHIBITOR_PRODUCT_POSTER_TYPE = FILETYPE_EXHIBITORPRODUCT_POSTER;
const CONFERENCE_POSTER_TYPE = FILETYPE_CONFERENCE_POSTER;

const ROLES = Role.ROLE;

export {
  FILE_TYPE,
  FILE_TYPE_INFO,
  VOTE_OPTION_POSTER_TYPE,
  VoteOptionFileInfo,
  USER_PROFILE_TYPE,
  UserProfileFileInfo,
  EXHIBITOR_POSTER_TYPE,
  ExhibitorPosterFileInfo,
  EXHIBITOR_LOGO_POSTER_TYPE,
  ExhibitorLogoPosterFileInfo,
  ExhibitorVideoFileInfo,
  EXHIBITOR_VIDEO_TYPE,
  EXHIBITOR_PRODUCT_POSTER_TYPE,
  ExhibitorProductPosterFileInfo,
  ConferencePosterFileInfo,
  CONFERENCE_POSTER_TYPE,
}

export {
  R,
  ROUTES,
  CONSTANTS,
  C,
  VOTE_QUESTION_TYPE,
  VOTE_QUESTION_CHART_TYPE,
  STREAM_TYPE,
  CARD_SIZE,
  CARD_TYPE,
  ROLES,
};
