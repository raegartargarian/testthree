export interface INetworkModel {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  isTestnet?: boolean;
  chainId?: number;
  serverName: NETWORK_SERVER_NAMES;
  explorerUrl: string;
}

// Network Configuration with updated logo URLs
export const SUPPORTED_NETWORKS: INetworkModel[] = [
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    logoUrl:
      "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    chainId: 137,
    serverName: "POLYGON_ZKEVM",
    explorerUrl: import.meta.env.VITE_POLYGON_SCANNER,
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    logoUrl:
      "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    chainId: 1,
    serverName: "XRPL",
    explorerUrl: import.meta.env.VITE_XRP_SCANNER,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    logoUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    chainId: 1,
    serverName: "ETHEREUM",
    explorerUrl: import.meta.env.VITE_ETHEREUM_SCANNER,
  },
  // {
  //   id: 'avalanche',
  //   name: 'Avalanche',
  //   symbol: 'AVAX',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_AVAX_Red_Circle_Token.png',
  //   chainId: 43114,
  //   serverName:
  // },
  // {
  //   id: 'bnb',
  //   name: 'BNB Chain',
  //   symbol: 'BNB',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  //   chainId: 56,
  // },
  // {
  //   id: 'arbitrum',
  //   name: 'Arbitrum',
  //   symbol: 'ARB',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
  //   chainId: 42161,
  // },
];

// Helper Functions
export const getSupportedNetworks = (
  includeTestnets: boolean = false
): INetworkModel[] => {
  return SUPPORTED_NETWORKS.filter(
    (network) => includeTestnets || !network.isTestnet
  );
};

export const getNetworkById = (id: string): INetworkModel | undefined => {
  return SUPPORTED_NETWORKS.find((network) => network.id === id);
};

export const getLedgerNameFromServerName = (
  serverName: string | undefined
): string => {
  return (
    SUPPORTED_NETWORKS.find((network) => network.serverName === serverName)
      ?.name || ""
  );
};

export type NETWORK_SERVER_NAMES = "POLYGON_ZKEVM" | "XRPL" | "ETHEREUM";

export const getNetworkLogoByServerName = (
  serverName: NETWORK_SERVER_NAMES | undefined
): string => {
  return (
    SUPPORTED_NETWORKS.find((network) => network.serverName === serverName)
      ?.logoUrl || ""
  );
};
export const getNetworkExplorerUrlByServerName = (
  serverName: NETWORK_SERVER_NAMES | undefined
): string => {
  return (
    SUPPORTED_NETWORKS.find((network) => network.serverName === serverName)
      ?.explorerUrl || ""
  );
};
