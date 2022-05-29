// Framework imports
import Link from "next/link";
import { useRouter } from "next/router";

// Component imports
import { PaddedLink, NavLink } from "./page-navigation";

// Util imports
import { useClientAuthContext } from "utils/client-auth-context";

// Type imports
import { MouseEvent, useEffect, useRef, useState } from "react";
import { fetchAuthInfo } from "src/utils/client-side-fetch-auth-info";
import { DividerLine } from "./divider-line";

import PhoneIcon from "bootstrap-icons/icons/telephone-fill.svg";

export function PageHeader() {
    const { clientAuthState, setClientAuthState } = useClientAuthContext();

    const router = useRouter();

    async function processLogOut(href: string) {
        const response = await fetch(href);
        if (!response.ok) {
            throw response;
        }
        setClientAuthState(await fetchAuthInfo());
        router.push("/");
    }

    function handleLogOut(ev: MouseEvent<HTMLAnchorElement>) {
        ev.preventDefault();
        if (!(ev.target instanceof HTMLAnchorElement)) {
            return;
        }

        processLogOut(ev.target.getAttribute("href")!);
    }

    function renderAccountOptions() {
        const PlainLink = ({ className, ...props}: any) => <PaddedLink className="hover:bg-gray-700 active:bg-gray-600" {...props} />
        if (!clientAuthState) {
            return (
                <p className="md:hidden text-white opacity-50 font-semibold">Memuat informasi akun...</p>
            );
        }

        if (!clientAuthState.isAuthenticated) {
            return (
                <>
                    <PlainLink href="/masuk">Masuk</PlainLink>
                    <PlainLink href="/daftar">Daftar</PlainLink>

                    <PaddedLink href="/daftar" className="px-3 bg-white text-gray-800 ml-2 hover:bg-gray-100 active:bg-gray-200 flex items-center">
                        <PhoneIcon /> Call us
                    </PaddedLink>
                </>
            );
        }

        return (
            <>
                <PlainLink href="/dasbor">Dasbor</PlainLink>
                <PlainLink href="/api/account/logout">Keluar akun</PlainLink>
            </>
        );
    }

    const [isMobileMenuShown, _setMobileMenuShown] = useState(false);

    const mobileMenuElement = useRef<HTMLDivElement>(null);

    function setMobileMenuShown(value: ValueOrCallbackParam<typeof isMobileMenuShown>) {
        if ((typeof value === "function" ? value(isMobileMenuShown) : value) === false) {
            if (
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches && 
                !window.matchMedia("(min-width: 768px)").matches
            ) {
                const duration = 200;
                mobileMenuElement.current?.animate([
                    {
                        transform: "translateY(-10%)",
                        opacity: 0,
                        offset: 1
                    }
                ], {
                    duration,
                    easing: "ease"
                });
                setTimeout(() => {_setMobileMenuShown(false)}, duration);
            }
            else {
                // Set directly
                return _setMobileMenuShown(false);
            }
        }
        else {
            return _setMobileMenuShown(true);
        }
    }


    useEffect(() => {
        function handleRouteChange() {
            setMobileMenuShown(false);
        }
        router.events.on("routeChangeStart", handleRouteChange);


        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        }
    }, []);

    return (
        <header className="sticky top-0 z-40" id="pageHeader">
            <nav className="flex items-center md:justify-between px-8 py-4 bg-gray-800 text-white">
                <button
                    className="md:hidden"
                    onClick={() => {setMobileMenuShown((prevVal) => !prevVal)}}
                >
                    Menu
                </button>
                <Link href="/">
                    <a className="block mr-2">
                        <h1 className="text-4xl tracking-tight leading-none">
                            <span className="font-bold">Lip</span>
                            <span className="font-light">Sum</span>
                        </h1>
                    </a>
                </Link>

                <DividerLine className="mx-3 bg-white bg-opacity-25" />

                <div className={[
                    "mobile-menu-container",
                    `fixed ${isMobileMenuShown ? "flex" : "hidden"} w-full h-full top-0 left-0 -z-1 bg-gray-900 items-center justify-around`,
                    `flex-col md:flex-row`,
                    `md:flex md:static md:z-auto md:items-center md:justify-between md:flex-grow md:bg-transparent md:animate-none`
                ].join(' ')} ref={mobileMenuElement}>
                    <div className="flex md:items-center flex-col md:flex-row text-lg md:text-base">
                        <NavLink href="/masuk">Tentang Kami</NavLink>
                        <NavLink href="/#hotline">Hotline</NavLink>
                    </div>

                    <div className="flex items-center">
                        {renderAccountOptions()}
                    </div>
                </div>

            </nav>

            <style jsx>{`
                @keyframes mobile-menu-entrance {
                    from {
                        transform: translateY(-10%);
                        opacity: 0;
                    }
                }

                .mobile-menu-container {
                    animation: mobile-menu-entrance 0.2s ease-out;
                }
                @media (min-width: 768px) {
                    .mobile-menu-container {
                        animation: none;
                    }
                }
            `}</style>

            <style jsx global>{`
                body {
                    --page-header-height: calc(calc(1.5rem * 1.2) + 2rem);
                    position: relative;

                    ${isMobileMenuShown ? "overflow: hidden;" : ''}
                }

                @media (min-width: 768px) {
                    body {
                        position: static;
                        ${isMobileMenuShown ? "overflow: unset;" : ''}
                    }
                }
            `}</style>
        </header>
    )
}
