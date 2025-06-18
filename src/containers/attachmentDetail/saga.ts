import { getAttachmentDetail } from "@/shared/providers/templateSDK";
import {
  getIPFSIMGAddr,
  getIPFSIMGAddrPrivate,
} from "@/shared/utils/getIPFSAddrs";
import { LocalStorageKeys } from "@/shared/utils/localStorageHelpers";
import { processZipFile } from "@/shared/utils/zipHandler";
import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { AttachmentModel } from "../attachments/types";
import { attachmentDetailActions } from "./slice";

function* fetchAttachmentDetailSaga(
  action: ReturnType<typeof attachmentDetailActions.fetchAttachmentDetailStart>
): any {
  try {
    const { id } = action.payload;
    yield new Promise((resolve) => setTimeout(resolve, 3000));

    const response = yield call(getAttachmentDetail, id);

    const attachment: AttachmentModel = response;
    yield put(
      attachmentDetailActions.fetchAttachmentDetailSuccess(attachment!)
    );

    // Check for zip files
    const files = attachment.files;
    const zipFiles = files?.filter((file) => {
      return file.filename?.match(/\.(zip)$/i) != null;
    });

    if (zipFiles && zipFiles.length > 0) {
      // Process first zip file found
      const zipAddr = attachment.public_vault
        ? getIPFSIMGAddr(zipFiles[0]?.cid ?? "")
        : getIPFSIMGAddrPrivate(zipFiles[0]?.cid ?? "");

      // Get token from localStorage
      const token = localStorage.getItem(LocalStorageKeys.jwtAccessKey);

      // Configure request with axios instead of fetch
      const config = {
        responseType: "arraybuffer" as const,
        headers: {},
      };

      // Add Bearer token if available
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
          "X-LedgerInfo": JSON.stringify({
            tx_hash: attachment.tx_hash,
            ledger: attachment.ledger,
          }),
        };
      } else {
        console.error("No access token found for private IPFS resource");
      }

      // Make axios request instead of fetch
      const zipResponse = yield call(axios.get, zipAddr, config);

      // Get data directly from axios response (no need to call arrayBuffer)
      const zipBuffer = zipResponse.data;
      const processedContent = yield call(processZipFile, zipBuffer);

      // Set content based on the type
      if (processedContent.type === "model-documentation") {
        yield put(
          attachmentDetailActions.setModelDocumentation(
            processedContent.content
          )
        );
      } else {
        yield put(
          attachmentDetailActions.setCodeContent(processedContent.content)
        );
      }
    }
  } catch (error: any) {
    yield put(
      attachmentDetailActions.fetchAttachmentDetailFailure(error.message)
    );
  }
}

export function* attachmentDetailSaga() {
  yield takeLatest(
    attachmentDetailActions.fetchAttachmentDetailStart.type,
    fetchAttachmentDetailSaga
  );
}
