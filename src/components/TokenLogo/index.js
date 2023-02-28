import React, { useState } from "react";
import styled from "styled-components";
import { isAddress } from "../../utils";

import { ReactComponent as HoneyLogo } from "../../assets/images/Honey.svg";
import { ReactComponent as EthereumLogo } from "../../assets/images/Ethereum.svg";

const testTokens = {
  ["0x5FC8d32690cc91D4c39d9d3abcBD16989F875707".toLowerCase()]: "0xdac17f958d2ee523a2206206994597c13d831ec7", // usdt
  ["0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9".toLowerCase()]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // usdc
  ["0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6".toLowerCase()]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // weth
  ["0xa513E6E4b8f2a923D98304ec87F64353C4D5C853".toLowerCase()]: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // wbtc
  ["0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9".toLowerCase()]: "0x6b175474e89094c44da98b954eedeac495271d0f", // dai
  ["0x0165878A594ca255338adfa4d48449f69242Eb8F".toLowerCase()]: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // matic
};

const TOKEN_ICON_API = (address) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${isAddress(
    address
  )}/logo.png`;
const BAD_IMAGES = {};

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: 1rem;
`;

const Emoji = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const StyledEthLogo = styled(EthereumLogo)`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const StyledHoneyLogo = styled(HoneyLogo)`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export default function TokenLogo({ address, size = "1rem", ...rest }) {
  const [error, setError] = useState(false);

  if (address === "ETH") {
    return <StyledEthLogo size={size} />;
  }

  if (address === "0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9") {
    return <StyledHoneyLogo size={size} />;
  }

  if (error && BAD_IMAGES[address]) {
    return (
      <Emoji {...rest} size={size}>
        <span role="img" aria-label="Thinking">
          🤔
        </span>
      </Emoji>
    );
  }

  const path = TOKEN_ICON_API(
    testTokens[address.toLowerCase()] || address.toLowerCase()
  );

  return (
    <Image
      {...rest}
      alt={address}
      src={path}
      size={size}
      onError={() => {
        BAD_IMAGES[address] = true;
        setError(true);
      }}
    />
  );
}
