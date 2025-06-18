import { ModelDocumentation } from "@/shared/utils/zipHandler";
import { AttachmentModel } from "../attachments/types";
import { FileStructure } from "./components/codeBlock";

export interface AttachmentDetailState {
  attachment: AttachmentModel | null;
  isLoading: boolean;
  error: string | null;
  contentType: "code" | "model-documentation" | null;
  fileStructure: FileStructure[] | null;
  modelDocumentation: ModelDocumentation | null;
}
