import { AttachmentModel } from "@/containers/attachments/types";

export const getAttachmentStatusName = (status: AttachmentModel["status"]) => {
  switch (status) {
    case "FILEDGR_RECEIVED":
      return "Received";
    case "FILEDGR_REVIEWED":
      return "Reviewed";
    case "FILEDGR_UPLOADED":
      return "Uploaded";
    case "DCSTORAGE_REPLICATED":
      return "Replicated";
    case "FILEDGR_DATA_ATTACHMENT_COMPLETED":
      return "Completed";
    default:
      return status;
  }
};
