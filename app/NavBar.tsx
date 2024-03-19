'use client';

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdArrowRightAlt } from "react-icons/md";

const Navbar = () => {
  const navItems = [{ href: "/companies", label: "Companies" }];
  const currentPath = usePathname();

  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <span className="flex">
          <MdArrowRightAlt className="m-1" />
          <span className="font-bold">Propo App</span>
        </span>
      </Link>
      <ul className="flex space-x-6">
        {navItems.map(({ href, label }) => (
          <Link
            key={`${href}`}
            href={href}
            className={classNames({
              "text-zinc-900": href === currentPath,
              "text-zinc-500": href !== currentPath,
              "hover:text-zinc-800 transition-colors": true,
            })}>
            {label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
