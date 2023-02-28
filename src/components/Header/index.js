import React from "react";
import styled from "styled-components";

import Web3Status from "../Web3Status";
import { darken } from "polished";

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  z-index: 2;
`;

const HeaderSpan = styled.span`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const HeaderElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  #link {
    text-decoration-color: ${({ theme }) => theme.UniswapPink};
  }

  #title {
    display: inline;
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.wisteriaPurple};
    :hover {
      color: ${({ theme }) => darken(0.1, theme.wisteriaPurple)};
    }
  }
`;

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
`;

export default function Header() {
  return (
    <HeaderFrame>
      <HeaderSpan>
        <HeaderElement>
          <Title></Title>
          <TestnetWrapper></TestnetWrapper>
        </HeaderElement>
        <HeaderElement>
          <Web3Status />
        </HeaderElement>
      </HeaderSpan>
    </HeaderFrame>
  );
}
