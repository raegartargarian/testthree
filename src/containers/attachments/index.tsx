import bg from "@/assets/images/bg-back.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/shared/components/BackButton";
import NoActivity from "@/shared/components/EmptyData";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator";
import { formatKebabCase } from "@/shared/utils/formatKebab";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { GlobalSelectors } from "../global/selectors";
import AttachmentItem from "./components/AttachmentItem";
import { attachmentsSelectors } from "./selectors";
import { attachmentsActions } from "./slice";

const ProofOfReserveAttachments = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Get attachments data from Redux
  const attachments = useSelector(attachmentsSelectors.attachments);
  const isFirstLoading = useSelector(attachmentsSelectors.isFirstLoading);
  const isFetching = useSelector(attachmentsSelectors.isFetching);
  const currentPage = useSelector(attachmentsSelectors.currentPage);
  const hasMore = useSelector(attachmentsSelectors.hasMore);

  // Refs for infinite scroll
  const lastAttachmentRef = useRef<HTMLDivElement | null>(null);

  // Get token data
  const tokenCodes = useSelector(GlobalSelectors.tokens);
  const tokenParam = searchParams.get("token");
  const tokenData = tokenCodes?.find((token) => token.name === tokenParam);
  const authData = useSelector(GlobalSelectors.authData);
  // Fetch initial data when token changes
  useEffect(() => {
    if (tokenData) {
      dispatch(
        attachmentsActions.fetchAttachmentsStart({
          page: 1,
          token: tokenData,
        })
      );
    }
  }, [dispatch, tokenData, tokenParam, authData]);

  // Handle fetching next page
  const fetchNextPage = useCallback(() => {
    if (hasMore && !isFetching && tokenData) {
      dispatch(
        attachmentsActions.fetchAttachmentsStart({
          page: currentPage + 1,
          token: tokenData,
        })
      );
    }
  }, [hasMore, isFetching, dispatch, currentPage, tokenData]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (lastAttachmentRef.current) {
      observer.observe(lastAttachmentRef.current);
    }

    return () => {
      if (lastAttachmentRef.current) {
        observer.unobserve(lastAttachmentRef.current);
      }
    };
  }, [lastAttachmentRef, fetchNextPage, hasMore]);

  // Show empty state if no attachments
  if (!isFirstLoading && attachments.length === 0) {
    return (
      <div className="w-full container mx-auto">
        <BackButton />
        <div className="flex justify-center items-center u-card w-[600px] h-[500px] mt-9 mx-auto">
          <NoActivity
            title="No Attachments"
            description="No attachments found"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="u-page u-bg bg-cover bg-center bg-fixed bg-no-repeat"
      // @ts-ignore
      style={{ "--bg-image": `url(${bg})` }}
    >
      <div className="container m-auto">
        <div className="w-full mt-10 mb-8 flex flex-col items-center">
          <h1 className="text-white font-extralight text-4xl">
            The List of {formatKebabCase(tokenData?.name ?? "")} Attachments
          </h1>
          <p className="text-gray-400 mt-2 font-utopia-regular">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="w-full mt-5">
          {isFirstLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                className="h-[120px] mb-[10px] w-full bg-gray-950 rounded-xl"
                key={index}
              />
            ))
          ) : (
            <>
              {attachments.map((attachment, index) => (
                <div
                  key={attachment.id}
                  className="w-full u-card mb-6"
                  ref={
                    index === attachments.length - 1 ? lastAttachmentRef : null
                  }
                >
                  <AttachmentItem attachment={attachment} />
                </div>
              ))}
              {isFetching && (
                <div className="w-full flex items-center justify-center">
                  <LoadingIndicator />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProofOfReserveAttachments;
