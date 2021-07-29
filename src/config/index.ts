import ROUTES from "./routes.json";
import CONSTANTS from "./constants.json";

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


export {
  R,
  ROUTES,
  CONSTANTS,
  C,
  FILE_TYPE,
  FILE_TYPE_INFO,
  VOTE_QUESTION_TYPE,
  VOTE_QUESTION_CHART_TYPE
};
