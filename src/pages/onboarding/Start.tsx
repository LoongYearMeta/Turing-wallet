import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import points from '../../assets/Point.png';
import { Button } from '../../components/Button';
import { TopLogo, Text, YoursLogo,GithubIcon } from '../../components/Reusable';
import { Show } from '../../components/Show';
import { useBottomMenu } from '../../hooks/useBottomMenu';
import { useTheme } from '../../hooks/useTheme';
import { ColorThemeProps } from '../../theme';
import { storage } from '../../utils/storage';
import yoursLogo from '../../assets/turingmagic.png';
import topLogo from '../../assets/turingnewlog.png';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TitleText = styled.h1<ColorThemeProps>`
  font-size: 2rem;
  color: ${({ theme }) => theme.white};
  font-family: 'Inter', Arial, Helvetica, sans-serif;
  font-weight: 700;
  margin: 0.25rem 0;
  text-align: center;
`;

export const Start = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showStart, setShowStart] = useState(false);
  const { hideMenu, showMenu } = useBottomMenu();

  useEffect(() => {
    hideMenu();

    return () => {
      showMenu();
    };
  }, [hideMenu, showMenu]);

  // If the encrypted keys are present, take the user to the wallet page.
  useEffect(() => {
    storage.get(['encryptedKeys', 'connectRequest'], (result) => {
      if (result?.connectRequest) {
        setShowStart(false);
        navigate('/connect');
        return;
      }

      if (result?.encryptedKeys) {
        setShowStart(false);
        navigate('/bsv-wallet');
        return;
      }
      setShowStart(true);
    });
  }, [navigate]);

  return (
    <Show when={showStart}>
      <Content>
        <TopLogo src={topLogo}/>
        <YoursLogo src={yoursLogo} />
        <TitleText theme={theme}>Turing Wallet</TitleText>
        <Text theme={theme} style={{ margin: '0.25rem 0 1rem 0' }}>
          The Wallet for Second Life.
        </Text>
        <Button theme={theme} type="primary" label="Create New Wallet" onClick={() => navigate('/create-wallet')} />
        <Button
          theme={theme}
          type="secondary-outline"
          label="Restore Wallet"
          onClick={() => navigate('/restore-wallet')}
        />
        <GithubIcon
          style={{ marginTop: '1rem' }}
          src={points}
          title="TBC points are coming soon..."
          // onClick={() => window.open('https://github.com/yours-org', '_blank')}
        />
      </Content>
    </Show>
  );
};
