// SVG Icons (bootstrap-icons)
import InstagramIcon from "bootstrap-icons/icons/instagram.svg";
import TwitterIcon from "bootstrap-icons/icons/twitter.svg";

import React, { FC, ReactNode, SVGAttributes } from "react";
import { DividerLine } from "./divider-line";

function SocialItem({ iconComponent: Icon, url, children: text }: {
    iconComponent: FC<SVGAttributes<SVGElement>>;
    url: string;
    children: ReactNode;
}) {
    return (
        <li className="block">
            <a href={url} className="flex items-center hover:underline">
                <Icon className="h-4 w-auto mr-2" />
                <span>{text}</span>
            </a>

            <style jsx>{`
                li + li {
                    margin-top: 0.75rem;
                }
            `}</style>
        </li>
    )
}

export function Footer() {
    return (
        <footer className="py-8 px-10 bg-gray-800 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                <div className="flex-grow md:mr-8">
                    <p className="text-sm mt-4">
                        Website <b>Lorem Ipsum</b> adalah untuk lorem ipsum.
                    </p>
                </div>

                <DividerLine className="bg-white bg-opacity-20 hidden md:block" />

                <ul className="mt-8 md:mt-0 md:ml-8 text-sm">
                    <SocialItem iconComponent={InstagramIcon} url="https://instagram.com/instagram">@instagram</SocialItem>
                    <SocialItem iconComponent={TwitterIcon} url="https://twitter.com/twitter">@twitter</SocialItem>
                    <SocialItem iconComponent={InstagramIcon} url="https://instagram.com/instagram">@instagram</SocialItem>
                    <SocialItem iconComponent={TwitterIcon} url="https://twitter.com/twitter">@twitter</SocialItem>
                </ul>
            </div>

            <div>
                <p className="text-sm font-bold">&copy; 2020-2021 Enter some credits here</p>
            </div>


            {/* <style jsx>{`* { outline: 1px solid rgb(255 255 0 / 0.5) }`}</style> */}
        </footer>
    );
}