// src/containers/proofOfReserveAttachments/slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttachmentsState, AttachmentModel } from "./types";
import { TokenCodeModel } from "../global/types";

const initialState: AttachmentsState = {
  attachments: [],
  currentPage: 0,
  totalPages: null,
  isFirstLoading: false,
  isFetching: false,
  error: null,
  hasMore: true,
};

const attachmentsSlice = createSlice({
  name: "attachments",
  initialState,
  reducers: {
    fetchAttachmentsStart(
      state,
      action: PayloadAction<{ page: number; token: TokenCodeModel }>
    ) {
      state.isFetching = true;
      state.error = null;
      if (action.payload.page === 1) {
        state.isFirstLoading = true;
        state.attachments = [];
      }
    },
    fetchAttachmentsSuccess(
      state,
      action: PayloadAction<{
        attachments: AttachmentModel[];
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
      }>
    ) {
      state.isFetching = false;
      state.isFirstLoading = false;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.attachments = [...state.attachments, ...action.payload.attachments];
      state.hasMore = action.payload.hasMore;
    },
    fetchAttachmentsFailure(state, action: PayloadAction<string>) {
      state.isFetching = false;
      state.isFirstLoading = false;
      state.error = action.payload;
      state.hasMore = false;
    },
    resetAttachments(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { actions: attachmentsActions, reducer: attachmentsReducer } =
  attachmentsSlice;
