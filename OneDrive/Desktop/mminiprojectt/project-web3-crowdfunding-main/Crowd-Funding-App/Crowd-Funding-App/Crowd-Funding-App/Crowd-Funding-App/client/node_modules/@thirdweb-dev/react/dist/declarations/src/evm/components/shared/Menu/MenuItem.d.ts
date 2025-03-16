import { PropsOf } from "@emotion/react";
import { PropsWithChildren } from "react";
export interface MenuItemBaseProps {
    isSelectable?: boolean;
}
declare const MenuItemBase: import("@emotion/styled").StyledComponent<{
    theme?: import("@emotion/react").Theme | undefined;
    as?: import("react").ElementType<any> | undefined;
} & MenuItemBaseProps, import("react").DetailedHTMLProps<import("react").LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, {}>;
export interface MenuItemProps extends PropsOf<typeof MenuItemBase> {
    leftElement?: JSX.Element;
    rightElement?: JSX.Element;
}
export declare const MenuItem: React.FC<PropsWithChildren<MenuItemProps>>;
export {};
//# sourceMappingURL=MenuItem.d.ts.map