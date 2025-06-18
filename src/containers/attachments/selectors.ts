import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/types";
import { AttachmentsState } from "./types";

const selectAttachmentsState = (state: RootState): AttachmentsState =>
  state.attachments;

export const attachmentsSelectors = {
  attachments: createSelector(
    selectAttachmentsState,
    (state) => state.attachments
  ),
  currentPage: createSelector(
    selectAttachmentsState,
    (state) => state.currentPage
  ),
  totalPages: createSelector(
    selectAttachmentsState,
    (state) => state.totalPages
  ),
  isFirstLoading: createSelector(
    selectAttachmentsState,
    (state) => state.isFirstLoading
  ),
  isFetching: createSelector(
    selectAttachmentsState,
    (state) => state.isFetching
  ),
  error: createSelector(selectAttachmentsState, (state) => state.error),
  hasMore: createSelector(selectAttachmentsState, (state) => state.hasMore),
};
