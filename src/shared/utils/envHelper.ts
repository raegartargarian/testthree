import { ENV_TYPE } from "@/containers/global/types";

export const getClientIdForEnv = (env?: ENV_TYPE) => {
  if (!env) {
    throw new Error("Environment is required");
  }
  switch (env) {
    case "DEVELOPMENT":
      return "BNSyDdH_nAxDiITmWzlmGbdZXDqXDPPKLT6rGhIywzAqNmP6QgLllTc3pemXYwFZa4DCKQEwckIhK3DJK2GwQVM";
    case "TESTNET":
      return "BOoMXH7A31Fzl5neZ8t3HTjFVzs2WDv_Jr0-lzdgwXPSphp8XC4s65JLdKq9Renjp3LNuN9uhzrrmdTRp0riOIo";
    case "MAINNET":
      return "BHpico-cONjKGSJWN-xAFkRhaDAFm9OHYAAgh4I3WNoE87D9i_XlD_QnHskVPo_B_b97kYIblbxuQfME9aggV3A";
  }
};
