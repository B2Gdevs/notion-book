import React, { ReactNode, useEffect, useMemo, useState } from 'react';

type Props = {
  children: ReactNode | ReactNode[];
  title: string;
  description: string;
  source: string;
};

const StoryLayout = ({ children, title, description, source }: Props) => {
  const [tab, setTab] = useState('preview');

  return (
    <div className="w-full h-full my-4">
      <h1 className="text-4xl text-base-content ">{title}</h1>
      <div className="text-base-content">{description}</div>
      <div className="my-4">
        {/* Mobile view */}
        <div className="block sm:hidden">{children}</div>

        {/* Desktop view */}
        <div className="hidden sm:grid">
          Preview
          <div className="rounded-b-box rounded-tr-box relative overflow-x-auto">
            <div
              className="preview border-base-300 bg-base-200 rounded-b-box rounded-tr-box
                            flex min-h-[6rem] min-w-[18rem] flex-wrap items-center justify-center gap-2
                            overflow-x-hidden overflow-y-hidden border bg-cover bg-top p-4"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryLayout;
