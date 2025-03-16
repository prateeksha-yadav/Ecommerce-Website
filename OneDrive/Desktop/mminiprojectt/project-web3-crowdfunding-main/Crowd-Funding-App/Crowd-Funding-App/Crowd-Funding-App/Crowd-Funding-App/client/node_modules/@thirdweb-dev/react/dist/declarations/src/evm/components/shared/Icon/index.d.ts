import React from "react";
interface StyledSvg {
    boxSize?: string;
}
declare const StyledSvg: import("@emotion/styled").StyledComponent<{
    theme?: import("@emotion/react").Theme | undefined;
    as?: React.ElementType<any> | undefined;
} & StyledSvg, React.SVGProps<SVGSVGElement>, {}>;
declare const iconMap: {
    readonly ethereum: {
        readonly svgProps: {
            readonly viewBox: "0 0 28 28";
            readonly xmlns: "http://www.w3.org/2000/svg";
            readonly fill: "none";
        };
        readonly paths: JSX.Element;
    };
    readonly arbitrum: {
        readonly svgProps: {
            readonly viewBox: "0 0 28 28";
            readonly xmlns: "http://www.w3.org/2000/svg";
            readonly fill: "none";
        };
        readonly paths: JSX.Element;
    };
    readonly avalanche: {
        readonly svgProps: {
            readonly viewBox: "0 0 28 28";
            readonly xmlns: "http://www.w3.org/2000/svg";
            readonly fill: "none";
        };
        readonly paths: JSX.Element;
    };
    readonly optimism: {
        readonly svgProps: {
            readonly viewBox: "0 0 28 28";
            readonly xmlns: "http://www.w3.org/2000/svg";
            readonly fill: "none";
        };
        readonly paths: JSX.Element;
    };
    readonly polygon: {
        readonly svgProps: {
            readonly viewBox: "0 0 28 28";
            readonly xmlns: "http://www.w3.org/2000/svg";
            readonly fill: "none";
        };
        readonly paths: JSX.Element;
    };
    readonly fantom: {
        readonly svgProps: {
            readonly viewBox: "0 0 32 32";
            readonly xmlns: "http://www.w3.org/2000/svg";
        };
        readonly paths: JSX.Element;
    };
    readonly binance: {
        readonly svgProps: {
            readonly viewBox: "0 0 32 32";
            readonly xmlns: "http://www.w3.org/2000/svg";
        };
        readonly paths: JSX.Element;
    };
    readonly metamask: import("./types").SVGIconProps;
    readonly walletConnect: import("./types").SVGIconProps;
    readonly coinbaseWallet: import("./types").SVGIconProps;
};
export interface IconProps extends StyledSvg {
    name: keyof typeof iconMap;
}
export declare const Icon: React.FC<IconProps>;
export {};
//# sourceMappingURL=index.d.ts.map