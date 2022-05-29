import type { HTMLProps } from "react";

export function DividerLine({ className, style, role, ...restProps }: HTMLProps<HTMLDivElement>) {
    return (
        <div
            role="presentation"
            className={["self-stretch", className].filter((x) => x).join(' ')}
            style={{
                minHeight: 1,
                minWidth: 1,
                ...style
            }}
            {...restProps}
        />
    );
}