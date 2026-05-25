import { Fraunces } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import localFont from "next/font/local"

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
})

export const n27 = localFont({
  src: [
    { path: "../public/fonts/n27-thin-webfont.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/n27-thinitalic-webfont.woff2", weight: "100", style: "italic" },
    { path: "../public/fonts/n27-extralight-webfont.woff2", weight: "200", style: "normal" },
    { path: "../public/fonts/n27-extralightitalic-webfont.woff2", weight: "200", style: "italic" },
    { path: "../public/fonts/n27-light-webfont.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/n27-lightitalic-webfont.woff2", weight: "300", style: "italic" },
    { path: "../public/fonts/n27-regular-webfont.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/n27-regularitalic-webfont.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/n27-medium-webfont.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/n27-mediumitalic-webfont.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/n27-bold-webfont.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/n27-bolditalic-webfont.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-n27",
  display: "swap",
  preload: false,
})

export { GeistSans as geistSans, GeistMono as geistMono }
