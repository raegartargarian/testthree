import bg from "@/assets/images/bg-back.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/shared/components/BackButton";
import { formatDate } from "@/shared/utils/dateFormatter";
import {
  getIPFSIMGAddr,
  getIPFSIMGAddrPrivate,
} from "@/shared/utils/getIPFSAddrs";
import { getAttachmentStatusName } from "@/shared/utils/sttausHelpers";
import { viewTXInExplorer } from "@/shared/utils/viewVaultInExplorer";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GlobalSelectors } from "../global/selectors";
import { GitHubExplorer } from "./components/codeBlock";
import FilePreview from "./components/FilePreview";
import { ModelDocsViewer } from "./components/modelDocsViewer";
import { attachmentDetailSelectors } from "./selectors";
import { attachmentDetailActions } from "./slice";

const AttachmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const attachment = useSelector(attachmentDetailSelectors.attachment);
  const isLoading = useSelector(attachmentDetailSelectors.isLoading);
  const contentType = useSelector(attachmentDetailSelectors.contentType);
  const fileStructure = useSelector(attachmentDetailSelectors.fileStructure);
  const modelDocumentation = useSelector(
    attachmentDetailSelectors.modelDocumentation
  );
  const authData = useSelector(GlobalSelectors.authData);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isMobileFilesOpen, setIsMobileFilesOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(attachmentDetailActions.fetchAttachmentDetailStart({ id }));
    }
  }, [dispatch, id, authData]);

  useEffect(() => {
    if (
      attachment &&
      attachment.files &&
      attachment.files.length > 0 &&
      (!selectedFile || !attachment.files.find((f) => f.cid === selectedFile))
    ) {
      setSelectedFile(attachment.files[0].cid ?? "");
    }
  }, [attachment, selectedFile]);

  const handleDownloadAll = async () => {
    if (!attachment?.files?.length) return;

    // Find the zip file
    const zipFile = attachment.files.find(
      (file) => file.filename?.match(/\.(zip)$/i) != null
    );

    if (!zipFile) return;

    const ipfsUrl = attachment.public_vault
      ? getIPFSIMGAddr(zipFile.cid ?? "")
      : getIPFSIMGAddrPrivate(zipFile.cid ?? "");

    const response = await fetch(ipfsUrl);
    const blob = await response.blob();

    // Create a blob with the correct type if available
    const fileBlob = new Blob([blob], { type: zipFile.mimetype });

    // Create a download link
    const downloadUrl = window.URL.createObjectURL(fileBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = zipFile.filename || "download.zip";

    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Cleanup
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const toggleMobileFiles = () => {
    setIsMobileFilesOpen(!isMobileFilesOpen);
  };

  const renderModelDocViewer = () => {
    if (!modelDocumentation) return null;

    return (
      <div className="flex flex-col gap-8">
        <div className="mx-7">
          <ModelDocsViewer
            modelDetails={modelDocumentation.modelDetails}
            textFiles={modelDocumentation.textFiles}
          />
        </div>
      </div>
    );
  };

  const renderGitHubExplorer = () => {
    return (
      <div className="p-4 lg:p-6">
        <GitHubExplorer fileStructure={fileStructure ?? []} />
      </div>
    );
  };

  const renderRegularFilePreview = () => {
    if (!selectedFile) return null;

    return (
      <div className="h-full w-full bg-gray-900">
        <FilePreview
          key={selectedFile}
          fileUrl={getIPFSIMGAddr(selectedFile)}
          mimeType={
            attachment?.files?.find((f) => f.cid === selectedFile)?.mimetype ||
            ""
          }
          fileName={
            attachment?.files?.find((f) => f.cid === selectedFile)?.filename ||
            ""
          }
          fileSize={
            attachment?.files?.find((f) => f.cid === selectedFile)?.size
          }
        />
      </div>
    );
  };

  return (
    <div
      className="u-page container m-auto u-bg bg-cover bg-center bg-fixed bg-no-repeat"
      // @ts-ignore
      style={{ "--bg-image": `url(${bg})` }}
    >
      <div className="mb-8">
        <BackButton />
      </div>
      <div className="mb-8">
        <h2 className="text-3xl text-white font-utopia-regular">
          {attachment?.name}{" "}
          {attachment?.stream?.asset_code
            ? `- ${attachment?.stream?.asset_code?.slice(0, 8)}`
            : ""}
        </h2>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] w-full bg-gray-400 u-card" />
      ) : (
        <div className="u-card bg-gray-950">
          {/* Header with buttons */}
          <div className="border-b border-gray-800 p-4 lg:p-6 bg-gray-900">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold mb-2 text-white">
                  {attachment?.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {attachment?.status && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-gray-300"
                    >
                      {getAttachmentStatusName(attachment.status)}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
                {
                  <Button
                    className="w-full lg:w-auto"
                    onClick={handleDownloadAll}
                  >
                    <Download className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline">Download All</span>
                  </Button>
                }
                {attachment?.tx_hash && (
                  <Button
                    onClick={() => viewTXInExplorer(attachment.tx_hash!)}
                    variant="outline"
                    className="w-full lg:w-auto"
                  >
                    <ExternalLink className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline">View Transaction</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile files toggle */}
          {!contentType && (
            <Button
              variant="ghost"
              onClick={toggleMobileFiles}
              className="flex lg:hidden items-center justify-between w-full p-4 text-white bg-gray-900 border-b border-gray-800"
            >
              <span className="font-semibold">
                Files ({attachment?.files?.length || 0})
              </span>
              {isMobileFilesOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </Button>
          )}

          {/* Content */}
          <Tabs defaultValue="preview" className="flex-1">
            <TabsList className="px-4 lg:px-6 border-b border-gray-800 bg-gray-900">
              <TabsTrigger
                value="preview"
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800"
              >
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 h-full">
              {contentType === "model-documentation" && renderModelDocViewer()}
              {contentType === "code" && renderGitHubExplorer()}
              {!contentType && renderRegularFilePreview()}
            </TabsContent>

            <TabsContent value="details" className="p-4 lg:p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-white">Description</h3>
                  <p className="text-gray-400">
                    {attachment?.description || "No description provided"}
                  </p>
                </div>

                <Separator className="bg-gray-800" />

                <div>
                  <h3 className="font-semibold mb-2 text-white">Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Created on {formatDate(attachment?.created_at || "")}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{attachment?.files?.length || 0} files</span>
                    </div>
                    {attachment?.status && (
                      <div className="flex items-center text-sm text-gray-400">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        <span>
                          Status: {getAttachmentStatusName(attachment.status)}
                        </span>
                      </div>
                    )}
                    {attachment?.stream && (
                      <div className="flex items-center text-sm text-gray-400">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        <span className="break-all">
                          Stream ID: {attachment.stream.id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {attachment?.tx_hash && (
                  <>
                    <Separator className="bg-gray-800" />
                    <div>
                      <h3 className="font-semibold mb-2 text-white">
                        Transaction
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-400">
                          <LinkIcon className="w-4 h-4 mr-2" />
                          <span className="break-all">
                            TX Hash: {attachment.tx_hash}
                          </span>
                        </div>
                        <Button
                          onClick={() => viewTXInExplorer(attachment.tx_hash!)}
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View in Explorer
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AttachmentDetail;
