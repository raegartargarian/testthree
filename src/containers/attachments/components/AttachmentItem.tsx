import DataPlaceHolder from "@/assets/images/PH.png";
import { appRoutes } from "@/shared/constants/routes";
import { formatDate } from "@/shared/utils/dateFormatter";
import { viewTXInExplorer } from "@/shared/utils/viewVaultInExplorer";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AttachmentModel } from "../types";

interface AttachmentItemProps {
  attachment: AttachmentModel;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({ attachment }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${appRoutes.attachmentsDetail.name}${attachment.id}`);
  };

  return (
    <div className="flex items-center justify-between   gap-3">
      <div className="flex items-center gap-3">
        <img
          src={DataPlaceHolder}
          alt="attachment"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col gap-3">
          <p className="font-bold text-white">
            {/* if asset name is longer than 8 characters, use ... */}
            {attachment.name} - {attachment.stream?.asset_code?.slice(0, 8)}
          </p>
          <p className="font-extralight text-gray-500">
            {formatDate(attachment.created_at ?? "")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-between">
        <div
          onClick={() => {
            viewTXInExplorer(attachment.tx_hash ?? "");
          }}
          className=" h-[45px] w-[138px] flex items-center cursor-pointer text-gray-300 justify-center border border-gray-300 rounded-lmid"
        >
          Transaction
        </div>
        <div
          className="bg-green-300 h-[45px] w-[138px] flex items-center cursor-pointer text-white justify-center rounded-lmid"
          onClick={handleClick}
        >
          View Details
        </div>
      </div>
    </div>
  );
};

export default AttachmentItem;
