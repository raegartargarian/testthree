import { getTokensAttachment } from "@/shared/providers/templateSDK";
import { call, put, takeLatest } from "redux-saga/effects";
import { attachmentsActions } from "./slice";
import { AttachmentModel } from "./types";

function* fetchAttachmentsSaga(
  action: ReturnType<typeof attachmentsActions.fetchAttachmentsStart>
): any {
  try {
    const { page, token } = action.payload;
    const tokenCode = token.value;
    const response = yield call(getTokensAttachment, {
      tokenCode,
      page: page.toString(),
      pageSize: "15",
    });

    let crPage = page;
    let tPages = 0;
    let hasMore = false;
    let dt: AttachmentModel[] = [];
    dt = response.content;
    crPage = response.current_page;
    tPages = response.total_pages;
    hasMore = crPage < tPages;

    yield put(
      attachmentsActions.fetchAttachmentsSuccess({
        attachments: dt,
        currentPage: crPage,
        totalPages: tPages,
        hasMore: hasMore,
      })
    );
  } catch (error: any) {
    yield put(attachmentsActions.fetchAttachmentsFailure(error.message));
  }
}

export function* attachmentsSaga() {
  yield takeLatest(
    attachmentsActions.fetchAttachmentsStart.type,
    fetchAttachmentsSaga
  );
}
