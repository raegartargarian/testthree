import JSONFile from "@/json/ledger.json";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { GlobalSelectors } from "./selectors";
import { globalActions } from "./slice";
import { GlobalState, TokenCodeModel } from "./types";

function* fetchData(): any {
  try {
    //  read the json file
    const data = JSONFile as GlobalState["data"];
    console.log("🚀 ~ function*fetchData ~ data:", data);
    yield put(globalActions.setData(data));
  } catch (error) {}
}
function* fetchTokencodes(): any {
  try {
    const data = JSONFile as GlobalState["data"];
    console.log("🚀 ~ function*fetchTokencodes ~ data:", data);
    const tokenCodes = extractTokens(data);
    console.log("🚀 ~ function*fetchTokencodes ~ tokenCodes:", tokenCodes);
    tokenCodes && (yield put(globalActions.setTokenCodes(tokenCodes)));
    if (!tokenCodes) {
      throw new Error("No token codes found");
    }
  } catch (error) {
    console.error("error in fetching token codes", error);
  }
}
function* logOut(): any {
  try {
    const authData = (yield select(
      GlobalSelectors.authData
    )) as GlobalState["authData"];
    if (authData) {
      yield call(authData.logout);
    }
  } catch (error) {
    console.log("error in logOut", error);
  }
}

export function* globalSaga() {
  yield takeLatest(globalActions.fetchData, fetchData);
  yield takeLatest(globalActions.fetchTokencodes, fetchTokencodes);
  yield takeLatest(globalActions.logOut, logOut);
}
function extractTokens(
  data: GlobalState["data"]
): TokenCodeModel[] | undefined {
  return data?.vault.streams.map(
    (token: { trait_type: string; description: string; value: string }) => {
      const nameMatch = token.description.match(
        /The stream mapped to the (.*?) field/
      );
      const name = nameMatch ? nameMatch[1] : "unknown";
      return {
        name: name.toLowerCase(),
        value: token.value,
      };
    }
  );
}
