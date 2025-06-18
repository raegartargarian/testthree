import { ModelDocumentation } from "@/shared/utils/zipHandler";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttachmentModel } from "../attachments/types";
import { FileStructure } from "./components/codeBlock";
import { AttachmentDetailState } from "./types";

const initialState: AttachmentDetailState = {
  attachment: null,
  isLoading: false,
  error: null,
  contentType: null,
  fileStructure: null,
  modelDocumentation: null,
};

const attachmentDetailSlice = createSlice({
  name: "attachmentDetail",
  initialState,
  reducers: {
    fetchAttachmentDetailStart(state, _action: PayloadAction<{ id: string }>) {
      state.isLoading = true;
      state.error = null;
      state.attachment = null;
      state.contentType = null;
      state.fileStructure = null;
      state.modelDocumentation = null;
    },
    fetchAttachmentDetailSuccess(
      state,
      action: PayloadAction<AttachmentModel>
    ) {
      state.isLoading = false;
      state.attachment = action.payload;
    },
    fetchAttachmentDetailFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetAttachmentDetail(state) {
      Object.assign(state, initialState);
    },
    setCodeContent(state, action: PayloadAction<FileStructure[]>) {
      state.contentType = "code";
      state.fileStructure = action.payload;
      state.modelDocumentation = null;
    },
    setModelDocumentation(state, action: PayloadAction<ModelDocumentation>) {
      state.contentType = "model-documentation";
      state.modelDocumentation = action.payload;
      state.fileStructure = null;
    },
  },
});

export const {
  actions: attachmentDetailActions,
  reducer: attachmentDetailReducer,
} = attachmentDetailSlice;
