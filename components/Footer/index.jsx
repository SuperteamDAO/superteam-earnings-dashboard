import Link from "next/link";
import LogoImg from "../../public/logo.png";
import Image from "next/image";

const footerLinks = [
  {
    name: "Earn",
    href: "https://earn.superteam.fun/",
  },
  {
    name: "Build",
    href: "https://build.superteam.fun/",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/superteamdao",
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/Mq3ReaekgG",
  },
  {
    name: "Substack",
    href: "https://superteam.substack.com/",
  },
  {
    name: "Youtube",
    href: "https://www.youtube.com/@superteampodcast",
  },
];
const Footer = () => {
  return (
    <footer className="w-full my-10">
      <div className="flex justify-between items-start md:items-center mx-auto w-full px-4 max-w-7xl">
        <Image src={LogoImg} alt="superteam-logo" />
        <div className="text-white flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 justify-center">
          {footerLinks.map((link, key) => {
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:font-semibold"
              >
                {link.name}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
