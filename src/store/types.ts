import { AttachmentsState } from "@/containers/attachments/types";
import { DashboardState } from "../containers/dashboard/types";
import { GlobalState } from "../containers/global/types";
import { AttachmentDetailState } from "@/containers/attachmentDetail/types";

export interface RootState {
  global: GlobalState;
  dashboard: DashboardState;
  attachments: AttachmentsState;
  attachmentDetail: AttachmentDetailState;
}
