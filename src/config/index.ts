import ROUTES from "./routes.json";
import CONSTANTS from "./constants.json";
import { FileTypeInfo, SimpleObject } from "../AppModule/models";

export * from "./helper";

const R = ROUTES;
const C = CONSTANTS;
const { Upload, VoteQuestion, Role } = CONSTANTS;

const {
  FILETYPE: FILE_TYPE,
  FILETYPEINFO: FILE_TYPE_INFO
} = Upload;

const {
  VOTEQUESTIONTYPE: VOTE_QUESTION_TYPE,
  VOTEQUESTIONCHARTTYPE: VOTE_QUESTION_CHART_TYPE
} = VoteQuestion;

const { FILETYPEINFO_VOTEOPTION_POSTER } = FILE_TYPE_INFO;
const { FILETYPE_VOTEOPTION_POSTER } = FILE_TYPE;
const VoteOptionFileInfo = FILETYPEINFO_VOTEOPTION_POSTER as FileTypeInfo;
const VOTE_OPTION_POSTER_TYPE = FILETYPE_VOTEOPTION_POSTER;
const ROLES = Role.ROLE;

export {
  R,
  ROUTES,
  CONSTANTS,
  C,
  FILE_TYPE,
  FILE_TYPE_INFO,
  VOTE_QUESTION_TYPE,
  VOTE_QUESTION_CHART_TYPE,
  VOTE_OPTION_POSTER_TYPE,
  VoteOptionFileInfo,
  ROLES,
};
