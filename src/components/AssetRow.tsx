import { styled } from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import { ColorThemeProps } from '../theme';
import { HeaderText, Text } from './Reusable';
import { formatNumberWithCommasAndDecimals, formatUSD } from '../utils/format';
import { Show } from './Show';
import switchAsset from '../assets/switch-asset.svg';

const Container = styled.div<ColorThemeProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.darkAccent};
  padding: 1rem 0;
  width: 90%;
  border-radius: 0.5rem;
  margin: 0.25rem;
`;

const Icon = styled.img<{ size?: string }>`
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 1rem;
  border-radius: 50%;
`;

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TickerTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 1rem;
`;

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 1rem;
  width: 40%;
`;

export type AssetRowProps = {
  icon: string;
  ticker: string;
  balance: number;
  usdBalance: number;
  isUnlockPage?: boolean;
};

export const AssetRow = (props: AssetRowProps) => {
  const { icon, ticker, balance, usdBalance, isUnlockPage } = props;
  const unlockableAmount = usdBalance;
  const { theme } = useTheme();
  return (
    <Container theme={theme}>
      <TickerWrapper>
        <Show when={!!icon && icon.length > 0}>
          <Icon src={icon} />
        </Show>
        <TickerTextWrapper>
          <HeaderText style={{ fontSize: '1rem' }} theme={theme}>
            {ticker}
          </HeaderText>
          <Text style={{ margin: '0', textAlign: 'left' }} theme={theme}>
            {isUnlockPage ? 'Unlockable' : 'Balance'}
          </Text>
        </TickerTextWrapper>
      </TickerWrapper>
      <BalanceWrapper>
        <HeaderText style={{ textAlign: 'right', fontSize: '1rem' }} theme={theme}>
        {`${formatNumberWithCommasAndDecimals(balance, 6)}${isUnlockPage ? ' TBC' : ''}`}
          {/* {`${balance}${isUnlockPage ? ' TBC' : ''}`} */}
        </HeaderText>
        {/* <Text style={{ textAlign: 'right', margin: '0' }} theme={theme}>
          {isUnlockPage ? `${unlockableAmount} TBC` : formatUSD(usdBalance)}
        </Text> */}
      </BalanceWrapper>
    </Container>
  );
};
