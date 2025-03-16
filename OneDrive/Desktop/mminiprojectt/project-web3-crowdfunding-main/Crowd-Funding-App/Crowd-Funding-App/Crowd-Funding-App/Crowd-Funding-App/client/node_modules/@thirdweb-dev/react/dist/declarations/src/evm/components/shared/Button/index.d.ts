import { PropsOf } from "@emotion/react";
import { PropsWithChildren } from "react";
interface BaseButtonProps {
    hasRightElement?: boolean;
    hasLeftElement?: boolean;
    isLoading?: boolean;
}
declare const BaseButton: import("@emotion/styled").StyledComponent<{
    theme?: import("@emotion/react").Theme | undefined;
    as?: import("react").ElementType<any> | undefined;
} & BaseButtonProps, import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}>;
export interface ButtonProps extends Omit<PropsOf<typeof BaseButton>, "hasRightElement" | "hasLeftElement"> {
    variant?: "solid" | "outline";
    isDisabled?: boolean;
    leftElement?: JSX.Element;
    rightElement?: JSX.Element;
}
export declare const Button: React.FC<PropsWithChildren<ButtonProps>>;
export {};
//# sourceMappingURL=index.d.ts.map