import { GlobalState } from "@/containers/global/types";
import JSONFile from "@/json/ledger.json";

const jsonData = JSONFile as GlobalState["data"];
const getIPFsPubAddr = () => {
  return jsonData?.env === "DEVELOPMENT"
    ? ".ipfs.pub.dev.filedgr.network/#/home"
    : jsonData?.env === "TESTNET"
      ? ".ipfs.pub.test.filedgr.network/#/home"
      : ".ipfs.pub.filedgr.network/#/home";
};
const getIPFsPrivAddr = () => {
  return jsonData?.env === "DEVELOPMENT"
    ? ".ipfs.priv.dev.filedgr.network/"
    : jsonData?.env === "TESTNET"
      ? ".ipfs.priv.test.filedgr.network/"
      : ".ipfs.priv.filedgr.network/";
};

export const getIPFSIMGAddr = (cid: string) => {
  return `https://${cid}${getIPFsPubAddr()}`;
};
export const getIPFSIMGAddrPrivate = (cid: string) => {
  return `https://${cid}${getIPFsPrivAddr()}`;
};
