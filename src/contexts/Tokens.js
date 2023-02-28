import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import { useWeb3React } from "../hooks";
import {
  isAddress,
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getTokenExchangeAddressFromFactory,
  safeAccess,
} from "../utils";

const NAME = "name";
const SYMBOL = "symbol";
const DECIMALS = "decimals";
const EXCHANGE_ADDRESS = "exchangeAddress";

const UPDATE = "UPDATE";

const ETH = {
  ETH: {
    [NAME]: "Ethereum",
    [SYMBOL]: "ETH",
    [DECIMALS]: 18,
    [EXCHANGE_ADDRESS]: null,
  },
};

export const INITIAL_TOKENS_CONTEXT = {
  31337: {
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9": {
      [NAME]: "Dai Stablecoin",
      [SYMBOL]: "DAI",
      [DECIMALS]: 18,
      [EXCHANGE_ADDRESS]: "0x75537828f2ce51be7289709686A69CbFDbB714F1",
    },
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9": {
      [NAME]: "USD//C",
      [SYMBOL]: "USDC",
      [DECIMALS]: 6,
      [EXCHANGE_ADDRESS]: "0xE451980132E65465d0a498c53f0b5227326Dd73F",
    },
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707": {
      [NAME]: "Tether",
      [SYMBOL]: "USDT",
      [DECIMALS]: 6,
      [EXCHANGE_ADDRESS]: "0x5392A33F7F677f59e833FEBF4016cDDD88fF9E67",
    },
    "0x0165878A594ca255338adfa4d48449f69242Eb8F": {
      [NAME]: "Matic",
      [SYMBOL]: "MATIC",
      [DECIMALS]: 18,
      [EXCHANGE_ADDRESS]: "0xa783CDc72e34a174CCa57a6d9a74904d0Bec05A9",
    },
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853": {
      [NAME]: "Wrapped BTC",
      [SYMBOL]: "WBTC",
      [DECIMALS]: 8,
      [EXCHANGE_ADDRESS]: "0xB30dAf0240261Be564Cea33260F01213c47AAa0D",
    },
    "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6": {
      [NAME]: "Wrapped Ether",
      [SYMBOL]: "WETH",
      [DECIMALS]: 8,
      [EXCHANGE_ADDRESS]: "0x61ef99673A65BeE0512b8d1eB1aA656866D24296",
    },
  },
};

const TokensContext = createContext();

function useTokensContext() {
  return useContext(TokensContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const {
        networkId,
        tokenAddress,
        name,
        symbol,
        decimals,
        exchangeAddress,
      } = payload;
      return {
        ...state,
        [networkId]: {
          ...(safeAccess(state, [networkId]) || {}),
          [tokenAddress]: {
            [NAME]: name,
            [SYMBOL]: symbol,
            [DECIMALS]: decimals,
            [EXCHANGE_ADDRESS]: exchangeAddress,
          },
        },
      };
    }
    default: {
      throw Error(
        `Unexpected action type in TokensContext reducer: '${type}'.`
      );
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_TOKENS_CONTEXT);

  const update = useCallback(
    (networkId, tokenAddress, name, symbol, decimals, exchangeAddress) => {
      dispatch({
        type: UPDATE,
        payload: {
          networkId,
          tokenAddress,
          name,
          symbol,
          decimals,
          exchangeAddress,
        },
      });
    },
    []
  );

  return (
    <TokensContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </TokensContext.Provider>
  );
}

export function useTokenDetails(tokenAddress) {
  const { library, chainId } = useWeb3React();

  const [state, { update }] = useTokensContext();
  const allTokensInNetwork = {
    ...ETH,
    ...(safeAccess(state, [chainId]) || {}),
  };
  const {
    [NAME]: name,
    [SYMBOL]: symbol,
    [DECIMALS]: decimals,
    [EXCHANGE_ADDRESS]: exchangeAddress,
  } = safeAccess(allTokensInNetwork, [tokenAddress]) || {};

  useEffect(() => {
    if (
      isAddress(tokenAddress) &&
      (name === undefined ||
        symbol === undefined ||
        decimals === undefined ||
        exchangeAddress === undefined) &&
      (chainId || chainId === 0) &&
      library
    ) {
      let stale = false;
      const namePromise = getTokenName(tokenAddress, library).catch(() => null);
      const symbolPromise = getTokenSymbol(tokenAddress, library).catch(
        () => null
      );
      const decimalsPromise = getTokenDecimals(tokenAddress, library).catch(
        () => null
      );
      const exchangeAddressPromise = getTokenExchangeAddressFromFactory(
        tokenAddress,
        chainId,
        library
      ).catch(() => null);

      Promise.all([
        namePromise,
        symbolPromise,
        decimalsPromise,
        exchangeAddressPromise,
      ]).then(
        ([
          resolvedName,
          resolvedSymbol,
          resolvedDecimals,
          resolvedExchangeAddress,
        ]) => {
          if (!stale) {
            update(
              chainId,
              tokenAddress,
              resolvedName,
              resolvedSymbol,
              resolvedDecimals,
              resolvedExchangeAddress
            );
          }
        }
      );
      return () => {
        stale = true;
      };
    }
  }, [
    tokenAddress,
    name,
    symbol,
    decimals,
    exchangeAddress,
    chainId,
    library,
    update,
  ]);

  return { name, symbol, decimals, exchangeAddress };
}

export function useAllTokenDetails() {
  const { chainId } = useWeb3React();

  const [state] = useTokensContext();

  return useMemo(() => ({ ...ETH, ...(safeAccess(state, [chainId]) || {}) }), [
    state,
    chainId,
  ]);
}
