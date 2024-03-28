import { styled } from 'styled-components';
import logo from '../assets/turingnewlog.png';
import { useTheme } from '../hooks/useTheme';
import { GithubIcon, Text } from './Reusable';
import activeCircle from '../assets/redround.png';
import { useKeys } from '../hooks/useKeys';
import { truncate } from '../utils/format';
// import gitHubIcon from '../assets/github.svg';
import points from '../assets/Point.png';
import { useSnackbar } from '../hooks/useSnackbar';
// position: fixed;
//   width: 100%;这里是修改回插件
//   margin-left: 9px;
//   top: 20px;
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-left: 9px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;
//logo太宽
const Logo = styled.img`
  width: 90px;
  margin: 26px；
`;


const Circle = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
`;

export const TopNav = () => {
  const { theme } = useTheme();
  const { bsvAddress } = useKeys();
  const { addSnackbar } = useSnackbar();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(bsvAddress).then(() => {
      addSnackbar('Copied!', 'success');
    });
  };

  return (
    <Container>
      <LogoWrapper>
        <Logo src={logo} />
        <Text style={{ margin: '0', marginLeft: '0.25rem' }} theme={theme}>
          |
        </Text>
        <Circle src={activeCircle} />
        <Text
          style={{ margin: '0 0 0 0.25rem', color: theme.white, fontSize: '0.75rem' }}
          theme={theme}
          onClick={handleCopyToClipboard}
        >
          {truncate(bsvAddress, 5, 5)}
        </Text>
      </LogoWrapper>
      <GithubIcon
        style={{ marginRight: '1.5rem' ,cursor: 'pointer'}}
        src={points}
        title='TBC points are coming soon...'
        onClick={() => addSnackbar('TBC points are coming soon...', 'info')}
        // onClick={() => window.open('https://github.com/yours-org', '_blank')}
      />
    </Container>
  );
};
