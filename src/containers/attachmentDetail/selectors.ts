import { RootState } from "@/store/types";
import { createSelector } from "@reduxjs/toolkit";
import { AttachmentDetailState } from "./types";

const selectAttachmentDetailState = (state: RootState): AttachmentDetailState =>
  state.attachmentDetail;

export const attachmentDetailSelectors = {
  attachment: createSelector(
    selectAttachmentDetailState,
    (state) => state.attachment
  ),
  isLoading: createSelector(
    selectAttachmentDetailState,
    (state) => state.isLoading
  ),
  error: createSelector(selectAttachmentDetailState, (state) => state.error),
  contentType: createSelector(
    selectAttachmentDetailState,
    (state) => state.contentType
  ),
  fileStructure: createSelector(
    selectAttachmentDetailState,
    (state) => state.fileStructure
  ),
  modelDocumentation: createSelector(
    selectAttachmentDetailState,
    (state) => state.modelDocumentation
  ),
};
