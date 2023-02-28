import React from "react";
import ReactGA from "react-ga";
import styled from "styled-components";
import { darken, transparentize } from "polished";
import Toggle from "react-switch";

import { useDarkModeManager } from "../../contexts/LocalStorage";

const FooterFrame = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const StyledToggle = styled(Toggle)`
  margin-right: 24px;

  .react-switch-bg[style] {
    background-color: ${({ theme }) =>
      darken(0.05, theme.inputBackground)} !important;
    border: 1px solid ${({ theme }) => theme.concreteGray} !important;
  }

  .react-switch-handle[style] {
    background-color: ${({ theme }) => theme.inputBackground};
    box-shadow: 0 4px 8px 0
      ${({ theme }) => transparentize(0.93, theme.shadowColor)};
    border: 1px solid ${({ theme }) => theme.mercuryGray};
    border-color: ${({ theme }) => theme.mercuryGray} !important;
    top: 2px !important;
  }
`;

const EmojiToggle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: Arial sans-serif;
`;

export default function Footer() {
  const [isDark, toggleDarkMode] = useDarkModeManager();

  return (
    <FooterFrame>
      <StyledToggle
        checked={!isDark}
        uncheckedIcon={
          <EmojiToggle role="img" aria-label="moon">
            {/* eslint-disable-line jsx-a11y/accessible-emoji */}
            🌙️
          </EmojiToggle>
        }
        checkedIcon={
          <EmojiToggle role="img" aria-label="sun">
            {/* eslint-disable-line jsx-a11y/accessible-emoji */}
            {"☀️"}
          </EmojiToggle>
        }
        onChange={() => {
          ReactGA.event({
            category: "Advanced Interaction",
            action: "Toggle Theme",
            label: isDark ? "Light" : "Dark",
          });
          toggleDarkMode();
        }}
      />
    </FooterFrame>
  );
}
