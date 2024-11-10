'use client';

import React, { FC, useState } from 'react';
import { AvatarProps } from './avatar';
import { ColorfullLogo } from '../icons/ColorfullLogo';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { cn } from '../lib/utils';
import { BastionLogo } from '../icons/BastionLogo';
import { MenuIcon, ArrowLeft } from 'lucide-react';
import { Footer } from './footer';
import { usePathname } from 'next/navigation';

interface NavigationLink {
  name: string;
  href: string;
  active?: boolean;
}

interface NavigationCategory {
  name: string;
  links: NavigationLink[];
}

interface SideBarProps {
  categories?: NavigationCategory[];
  standaloneLinks?: NavigationLink[];
  onLinkClick?: (href: string) => void;
  profile?: AvatarProps;
  onLogoClick?: () => void;
  endComponent?: React.ReactNode;
  className?: string;
  env?: 'bastion' | 'vangaurd' | 'joint_op';
  onCollapseToggle?: (collapsed: boolean) => void;
}

export const SideBar: FC<SideBarProps> = ({
  categories = [],
  standaloneLinks = [],
  onLinkClick,
  onLogoClick,
  endComponent,
  env = 'vangaurd',
  onCollapseToggle
}: SideBarProps) => {
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState<string | null>(pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleLinkClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    href: string,
  ) => {
    event.preventDefault();
    setActiveLink(href);
    onLinkClick && onLinkClick(href);
    setIsSidebarOpen(false); // Close sidebar on link click for mobile
    onCollapseToggle?.(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onCollapseToggle?.(!isSidebarOpen);
  };

  const isLinkActive = (href: string) => {
    return activeLink === href;
  };

  return (
    <div
      className={cn(
        'bg-primary-off-white md:relative w-full md:w-72 h-full min-h-screen p-4 flex flex-col items-start transition-transform duration-300 z-10',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0', // Always visible on medium and larger screens
      )}
    >
      <button onClick={toggleSidebar} className="md:hidden text-primary-spinach-green absolute top-0 left-0 z-20">
        <MenuIcon size={24} />
      </button>
      {env === 'bastion' ? (
        <BastionLogo onClick={onLogoClick} />
      ) : (
        <div className='flex gap-2 justify-center items-center'>
          <ColorfullLogo onClick={onLogoClick} />
        </div>
      )}
      <div className="mt-8 w-full h-full">
        {categories?.map((category) => {
          return (
            <div
              key={'category-' + category.name}
              className={`mb-5 border-zinc-100 text-primary-spinach-green font-righteous`}
            >
              <h3 className=" mb-2 text-2xl">{category.name}</h3>
              <ul className="border-l-2 border-primary-almost-black/5 mb-4">
                {category.links?.map((link) => (
                  <li
                    key={'category-link-' + link.href}
                    className="relative group"
                  >
                    <div
                      className={`absolute h-full w-0.5 left-0 top-0 transition-all duration-300 
                                        ${isLinkActive(link.href)
                          ? 'bg-secondary-pink-salmon'
                          : ''
                        } group-hover:bg-secondary-pink-salmon`}
                    />
                    <Button
                      variant="ghost"
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`w-full text-left text-lg pl-4 pr-2 py-1 block transition-colors  duration-300 text-primary-spinach-green hover:text-secondary-peach-orange`}
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
              <Separator className="bg-primary-almost-black" />
            </div>
          );
        })}

        {standaloneLinks?.map((link) => (
          <div
            key={'standalone-link-' + link.href}
            className="relative group mb-4 font-righteous"
          >
            <div
              className={`absolute h-full w-0.5 left-0 top-0 transition-all duration-300 
            ${isLinkActive(link.href) ? 'bg-secondary-pink-salmon' : ''
                } group-hover:bg-secondary-pink-salmon`}
            />
            <Button
              variant="ghost"
              onClick={(e) => handleLinkClick(e, link.href)}
              className='w-full text-left pl-4 pr-2 py-1 block transition-colors text-lg duration-300 text-primary-spinach-green hover:text-secondary-peach-orange'
            >
              {link.name}
            </Button>
          </div>
        ))}
        {env === 'vangaurd' &&
          <div className='absolute bottom-8 w-full left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center'>
            <Button
              variant="default"
              onClick={onLogoClick}
              className='w-fit py-2 px-4 rounded-lg flex justify-start items-center gap-2 transition-colors bg-primary-lime-green duration-300 text-primary-spinach-green font-righteous hover:text-secondary-peach-orange'
            >
              <ArrowLeft size={22} /> <span className='pr-1 min-w-[90px]'>Back to Restaurants</span>
            </Button>
            <Footer isInSidebar={true} />
          </div>}
      </div>
      {endComponent}
    </div>
  );
};
