// import { FC, SVGAttributes } from "react";

declare module "*.svg" {
    const svgElement: React.FC<React.SVGAttributes<SVGElement>>;
    export default svgElement;
}