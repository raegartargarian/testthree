interface ProgressStep {
  step?: number;
  status?: string;
  completed_at?: string;
}

export interface AttachmentModel {
  id?: string;
  name?: string;
  description?: string | null;
  created_at?: string;
  ledger?: string;
  status?:
    | "FILEDGR_RECEIVED"
    | "FILEDGR_REVIEWED"
    | "FILEDGR_UPLOADED"
    | "DCSTORAGE_REPLICATED"
    | "FILEDGR_DATA_ATTACHMENT_COMPLETED";
  presigned_url?: string | null;
  stream_id?: string;
  filename?: string;
  tx_hash?: string | null;
  upload_as_zip?: boolean;
  size?: number;
  stream?: StreamModel;
  file_count?: number;
  files?: AttachmentFileModel[];
  progress?: ProgressStep[];
  public_vault: boolean;
}

export interface AttachmentFileModel {
  id?: string;
  filename?: string;
  mimetype?: string;
  created_at?: string;
  status?: string;
  hash?: string;
  size?: number;
  cid?: string;
}

export interface StreamModel {
  id?: string;
  created_at?: string;
  asset_code?: string;
  description?: string;
  ledger?: string;
  tx_hash?: string | null;
  status?:
    | "FILEDGR_RECEIVED"
    | "FILEDGR_REVIEWED"
    | "DLT_STREAM_ID_REQUESTED"
    | "DLT_MINTED"
    | "FILEDGR_STREAM_COMPLETED";
  issuer?: string;
  distribution_wallet?: string;
  mapping?: string;
  metadata_cid?: string | null;
  progress?: ProgressStep[];
}

export interface AttachmentsState {
  attachments: AttachmentModel[];
  currentPage: number;
  totalPages: number | null;
  isFirstLoading: boolean;
  isFetching: boolean;
  error: string | null;
  hasMore: boolean;
}
