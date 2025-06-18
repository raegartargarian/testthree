declare module "react-360-view" {
  interface ThreeSixtyProps {
    images: string[];
    width?: string | number;
    height?: string | number;
    autoplay?: number;
    loop?: number;
    boxShadow?: boolean;
    disableScrollZoom?: boolean;
    disableSpinYAxis?: boolean;
  }

  export default function ThreeSixty(props: ThreeSixtyProps): JSX.Element;
}
