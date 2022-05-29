import Link from "next/link";
import { useRouter } from "next/router";
import { AnchorHTMLAttributes, forwardRef } from "react";

const PlainA = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
    function A({ className, ...restProps }, ref) {
        return <a className="hover:underline py-1 px-2" ref={ref} {...restProps} />;
    }
);

export function PaddedLink({ href, className, external, ...restProps }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    external?: boolean;
    href: string;
}) {
    const aProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
        className: [
            "py-1 px-2 rounded hover:underline transition-colors font-medium",
            className
        ].join(' '),

        ...restProps
    };

    if (external) {
        return <a href={href} {...aProps} />
    }

    return (
        <Link href={href}>
            <a {...aProps} />
        </Link>
    )
}

export function NavLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    const router = useRouter();
    const isCurrentPage = router.asPath === href;

    return (
        <>
            <Link href={href}>
                <a className={`py-1 px-2 block relative transition-colors ${isCurrentPage ? "font-bold active" : "opacity-90 hover:opacity-100"}`.trim()} {...props} />
            </Link>
            <style jsx>{`
                a::before {
                    content: "";
                    
                    display: inline-block;
                    vertical-align: middle;

                    width: 0.3rem;
                    height: 0.3rem;

                    margin-right: 0.5rem;
                    background-color: white;
                    opacity: 0.5;

                    border-radius: 50%;

                    transition: opacity 0.2s;
                }

                @media (min-width: 768px) {
                    a::before {
                        position: absolute;
                        bottom: 0;

                        left: 0;
                        right: 0;
                        margin: 0 auto;

                        display: block;
                        opacity: 0;

                        width: 0.25rem;
                        height: 0.25rem;
                    }
                }

                a:not(.active):hover::before {
                    opacity: 0.6;
                }

                a.active::before {
                    opacity: 1;
                }
            `}</style>
        </>
    );
}