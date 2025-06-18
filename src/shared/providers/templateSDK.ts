import { globalActions } from "@/containers/global/slice";
import { GlobalState } from "@/containers/global/types";
import JSONFile from "@/json/ledger.json";
import { store } from "@/main";
import FiledgrTemplateApi, {
  Constants,
  Types,
} from "@filedgr/filedgr-template-sdk";
import { LocalStorageKeys } from "../utils/localStorageHelpers";

const jsonData = JSONFile as GlobalState["data"];
const getTemplateEnv =
  jsonData?.env === "DEVELOPMENT"
    ? Constants.Environment.DEV
    : jsonData?.env === "TESTNET"
      ? Constants.Environment.TEST
      : Constants.Environment.PROD;

export const getTokensAttachment = async (params: {
  tokenCode: string;
  page: string;
  pageSize: string;
}): Promise<Types.StreamAttachmentResponse> => {
  const client = getTemplateSdkClient();

  return client.getTokensAttachment({
    tokenCode: params.tokenCode,
    page: params.page,
    pageSize: params.pageSize,
  });
};
export const getAttachmentDetail = async (
  id: string
): Promise<Types.GetDataAttachmentResponse> => {
  const client = getTemplateSdkClient();

  return client.getDataAttachment(id);
};
export const whiteListDomain = async (
  input: Types.DomainWhiteListRequest
): Promise<Types.DomainWhiteListResponse> => {
  const client = getTemplateSdkClient();

  return client.whiteListDomain(input);
};
export const getTemplateSdkClient = () => {
  let bearerToken = "public";
  const token = localStorage.getItem(LocalStorageKeys.jwtAccessKey);
  // check if token is expired
  if (token) {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const isTokenExpired = Date.now() >= tokenData.exp * 1000;
    if (isTokenExpired) {
      store.dispatch(globalActions.logOut());
    } else {
      bearerToken = `${token.replace(/"/g, "")}`;
    }
  }
  const client = new FiledgrTemplateApi({
    bearerToken: bearerToken,
    environment: getTemplateEnv,
  });
  return client;
};
