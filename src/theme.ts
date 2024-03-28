export interface Theme {
  darkAccent: string;
  mainBackground: string;
  lightAccent: string;
  primaryButton: string;
  white: string;
  black: string;
  gray: string;
  errorRed: string;
  warning: string;
}

export type ColorThemeProps = {
  theme: Theme;
};

// export const defaultTheme: Theme = {
//   darkAccent: '#17191E', //方框的颜色
//   mainBackground: '#010101',//主背景颜色
//   lightAccent: '#A1FF8B',
//   primaryButton: '#f4606c',// send按钮的颜色
//   white: '#FFFFFF',//字体颜色
//   black: '#000000',
//   gray: '#98A2B3',
//   errorRed: '#FF4646',
//   warning: '#F79009',
// };
export const defaultTheme: Theme = {
  darkAccent: '#17191E', //方框的颜色
  mainBackground: '#010101',//主背景颜色
  lightAccent: '#A1FF8B',
  primaryButton: '#D53B26',// send按钮的颜色
  white: '#FFFFFF',//字体颜色
  black: '#000000',
  gray: '#98A2B3',
  errorRed: '#FF4646',
  warning: '#F79009',
};
