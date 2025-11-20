"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  onTabChange,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  onTabChange?: (value: string) => void;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);

  const handleTabClick = (idx: number) => {
    setActive(propTabs[idx]);
    onTabChange?.(propTabs[idx].value);
  };

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
        containerClassName
      )}
    >
      {propTabs.map((tab, idx) => (
        <button
          key={tab.title}
          onClick={() => handleTabClick(idx)}
          className={cn("relative px-4 py-2 rounded-full", tabClassName)}
        >
          {active.value === tab.value && (
            <motion.div
              layoutId="clickedbutton"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className={cn(
                "absolute inset-0 bg-slate-800 dark:bg-slate-800 rounded-full",
                activeTabClassName
              )}
            />
          )}

          <span className="relative block text-white dark:text-white">
            {tab.title}
          </span>
        </button>
      ))}
    </div>
  );
};
