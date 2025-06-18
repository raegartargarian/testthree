// src/containers/global/Web3AuthProvider.tsx
import JSONFile from "@/json/ledger.json";
import { getClientIdForEnv } from "@/shared/utils/envHelper";
import { AuthAdapter } from "@web3auth/auth-adapter";
import {
  CHAIN_NAMESPACES,
  IAdapter,
  IProvider,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { createContext, useContext, useEffect, useState } from "react";
import { GlobalState } from "./types";

interface Web3AuthContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export const useWeb3Auth = () => {
  return useContext(Web3AuthContext);
};

export const Web3AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const twinData = JSONFile as GlobalState["data"];
  const clientId = getClientIdForEnv(twinData?.env);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // const whiteListSignature = await whiteListDomain({
        //   nft_id: twinData?.vault.nftId ?? "",
        //   ledger: twinData?.vault.ledger ?? "POLYGON_ZKEVM",
        // });
        const origin = window.location.origin;
        // remove any ending / or # from the origin
        const correctedOrigin = origin.replace(/\/$|#$/g, "");
        // const originData = {
        //   [correctedOrigin]: whiteListSignature.signature,
        // };
        // if (!originData) {
        //   throw new Error("Failed to get origin signature");
        // }
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId:
            twinData?.env === "MAINNET"
              ? "0x89" // hex of 137, mainnet
              : "0x13882", // hex of 80002, polygon testnet
          rpcTarget:
            twinData?.env === "MAINNET"
              ? "https://patient-attentive-moon.matic.quiknode.pro/e421f30bfdbed3036e4168567a9b21afabd9d77b/"
              : "https://withered-hidden-meme.matic-amoy.quiknode.pro/2573d0529c060b351ab3e634c4a1d5c1b1640081/",
          displayName:
            twinData?.env === "MAINNET" ? "Polygon" : "Polygon Amoy Testnet",
          blockExplorerUrl: "https://amoy.polygonscan.com/",
          ticker: "POL",
          tickerName: "Polygon Ecosystem Token",
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3AuthOptions: Web3AuthOptions = {
          clientId,
          web3AuthNetwork:
            twinData?.env === "MAINNET"
              ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
              : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        };

        const web3auth = new Web3Auth(web3AuthOptions);
        const adapters = await getDefaultExternalAdapters({
          options: web3AuthOptions,
        });
        const authAdapter = new AuthAdapter({
          privateKeyProvider,
          // adapterSettings: {
          //   originData: originData,
          // },
        });

        adapters.forEach((adapter: IAdapter<unknown>) => {
          web3auth.configureAdapter(adapter);
        });
        web3auth.configureAdapter(authAdapter);

        await web3auth.initModal();
        setWeb3auth(web3auth);

        if (web3auth.connected) {
          setProvider(web3auth.provider);
          setIsAuthenticated(true);
          const userInfo = await web3auth.getUserInfo();
          setUser(userInfo);
        }
      } catch (error: any) {
        console.error("Web3Auth initialization error:", error);
        setError(error.message || "Failed to initialize Web3Auth");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      setError("Web3Auth not initialized yet");
      return;
    }

    try {
      setError(null);
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setIsAuthenticated(true);
      const userInfo = await web3auth.getUserInfo();
      setUser(userInfo);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login");
    }
  };

  const logout = async () => {
    if (!web3auth) {
      setError("Web3Auth not initialized yet");
      return;
    }

    try {
      setError(null);
      localStorage.clear();
      await web3auth.logout();
      setProvider(null);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error.message || "Failed to logout");
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        web3auth,
        provider,
        isLoading,
        isAuthenticated,
        user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

// Create a new hook to consume the error state
export const useWeb3AuthError = () => {
  const context = useWeb3Auth();
  if (!context) {
    throw new Error("useWeb3AuthError must be used within a Web3AuthProvider");
  }
  return context.error;
};
