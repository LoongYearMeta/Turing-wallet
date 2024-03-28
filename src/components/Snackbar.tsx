import styled, { keyframes } from 'styled-components';
import { Text } from './Reusable';
import { SnackbarType } from '../contexts/SnackbarContext';
import { ColorThemeProps, Theme } from '../theme';
import errorIcon from '../assets/error.svg';
import infoIcon from '../assets/info-dark.svg';
import successIcon from '../assets/success.svg';

type SnackBarColorTheme = ColorThemeProps & { color: string };

const slideIn = keyframes`
  from {
    bottom: -15px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
`;

// Animation for fading out
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// export const BorderContainer = styled.div<SnackBarColorTheme>`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 90%;
//   position: absolute;
//   bottom: 0;
//   margin: 1rem;
//   padding: 0.5rem;
//   border-radius: 0.5rem;
//   background-color: ${({ color }) => color};
//   color: ${({ theme }) => theme.white};
//   z-index: 200;
//   animation:
//     ${slideIn} 0.25s ease-out,
//     ${fadeOut} 0.25s ease-out 2.5s;
//   animation-fill-mode: forwards;
// `;
export const SnackBarContainer = styled.div<SnackBarColorTheme>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  position: absolute;
  bottom: 0;
  margin: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ color }) => color};
  color: ${({ theme }) => theme.white};
  z-index: 200;
  animation:
    ${slideIn} 0.25s ease-out,
    ${fadeOut} 0.25s ease-out 2.5s;
  animation-fill-mode: forwards;
`;



const Image = styled.img`
  width: 1rem;
  height: 1rem;
  margin: 1rem;
`;

export type SnackbarProps = {
  /** The message that should be displayed on the snackbar */
  message: string;
  /** The type of snackbar. success | error | info */
  type: SnackbarType | null;
  theme: Theme;
};

export const Snackbar = (props: SnackbarProps) => {
  const { message, type, theme } = props;
  return (
    <SnackBarContainer color=''>
      {/* <Image src={type === 'error' ? errorIcon : type === 'info' ? infoIcon : successIcon}  /> */}
      <Text
        theme={theme}
        style={{
          margin: '1rem 0 2.5rem .25rem',
          color: type === 'error' ? theme.errorRed : type === 'info' ? theme.white : theme.lightAccent,
          wordWrap: 'break-word',
        }}
      >
        {message}
      </Text>
    </SnackBarContainer>
  );
};


// //用于展示应用中的提示消息，比如错误信息、系统信息或者成功信息。下面是对代码的详细解释：
// import styled, { keyframes } from 'styled-components';
// import { Text } from './Reusable';
// import { SnackbarType } from '../contexts/SnackbarContext';
// import { ColorThemeProps, Theme } from '../theme';
// import errorIcon from '../assets/error.svg';
// import infoIcon from '../assets/info-dark.svg';
// import successIcon from '../assets/success.svg';

// type SnackBarColorTheme = ColorThemeProps & { color: string };

// const slideIn = keyframes`
//   from {
//     bottom: -15px;
//     opacity: 0;
//   }
//   to {
//     bottom: 0;
//     opacity: 1;
//   }
// `;

// // Animation for fading out
// const fadeOut = keyframes`
//   from {
//     opacity: 1;
//   }
//   to {
//     opacity: 0;
//   }
// `;

// export const SnackBarContainer = styled.div<SnackBarColorTheme>`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 90%;
//   position: absolute;
//   bottom: 0;
//   margin: 1rem;
//   border-radius: 0.5rem;
//   background-color: ${({ color }) => color};
//   color: ${({ theme }) => theme.white};
//   z-index: 200;
//   animation:
//     ${slideIn} 0.25s ease-out,
//     ${fadeOut} 0.25s ease-out 2.5s;
//   animation-fill-mode: forwards;
// `;

// const Image = styled.img`
//   width: 1rem;
//   height: 1rem;
//   margin: 1rem;
// `;

// export type SnackbarProps = {
//   /** The message that should be displayed on the snackbar */
//   message: string;
//   /** The type of snackbar. success | error | info */
//   type: SnackbarType | null;
//   theme: Theme;
// };

// export const Snackbar = (props: SnackbarProps) => {
//   const { message, type, theme } = props;
//   return (
//     <SnackBarContainer color={type === 'error' ? theme.errorRed : type === 'info' ? theme.white : theme.lightAccent}>
//       <Image src={type === 'error' ? errorIcon : type === 'info' ? infoIcon : successIcon} />
//       <Text
//         theme={theme}
//         style={{
//           margin: '1rem 0 1rem .25rem',
//           color: type === 'error' ? theme.white : theme.darkAccent,
//           wordWrap: 'break-word',
//           textAlign: 'left',
//         }}
//       >
//         {message}
//       </Text>
//     </SnackBarContainer>
//   );
// };
