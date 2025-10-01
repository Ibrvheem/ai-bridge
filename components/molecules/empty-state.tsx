"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  /** Icon to display - can be any Lucide icon */
  icon?: LucideIcon;
  /** Custom icon element (overrides icon prop) */
  iconElement?: ReactNode;
  /** Main title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button configuration */
  action?: {
    label: string;
    onClick: () => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    icon?: LucideIcon;
  };
  /** Secondary action button configuration */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    icon?: LucideIcon;
  };
  /** Custom children to render instead of default content */
  children?: ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom className for styling */
  className?: string;
}

export function EmptyState({
  icon: Icon,
  iconElement,
  title,
  description,
  action,
  secondaryAction,
  children,
  size = "md",
  className = "",
}: EmptyStateProps) {
  const sizeConfig = {
    sm: {
      container: "py-8",
      icon: "h-8 w-8",
      title: "text-lg",
      description: "text-sm",
      gap: "gap-3",
    },
    md: {
      container: "py-12",
      icon: "h-12 w-12",
      title: "text-xl",
      description: "text-base",
      gap: "gap-4",
    },
    lg: {
      container: "py-16",
      icon: "h-16 w-16",
      title: "text-2xl",
      description: "text-lg",
      gap: "gap-6",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`text-center ${config.container} ${className}`}>
      <div className={`flex flex-col items-center ${config.gap}`}>
        {/* Icon */}
        {iconElement ||
          (Icon && (
            <div className="flex justify-center mb-2">
              <Icon className={`${config.icon} text-muted-foreground`} />
            </div>
          ))}

        {/* Content */}
        {children ? (
          children
        ) : (
          <>
            {/* Title */}
            <h3 className={`font-semibold text-foreground ${config.title}`}>
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p
                className={`text-muted-foreground max-w-md mx-auto ${config.description}`}
              >
                {description}
              </p>
            )}

            {/* Actions */}
            {(action || secondaryAction) && (
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                {action && (
                  <Button
                    onClick={action.onClick}
                    variant={action.variant || "default"}
                    className="min-w-[120px]"
                  >
                    {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                    {action.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    onClick={secondaryAction.onClick}
                    variant={secondaryAction.variant || "outline"}
                    className="min-w-[120px]"
                  >
                    {secondaryAction.icon && (
                      <secondaryAction.icon className="mr-2 h-4 w-4" />
                    )}
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Predefined variants for common use cases
export const EmptyStateVariants = {
  noData: {
    title: "No data found",
    description: "There's no data to display at the moment.",
  },
  noResults: {
    title: "No results found",
    description:
      "Try adjusting your search criteria to find what you're looking for.",
  },
  noItems: {
    title: "No items yet",
    description: "Get started by creating your first item.",
  },
  error: {
    title: "Something went wrong",
    description:
      "We encountered an error while loading the data. Please try again.",
  },
  loading: {
    title: "Loading...",
    description: "Please wait while we fetch your data.",
  },
  comingSoon: {
    title: "Coming Soon",
    description: "This feature will be available in a future update.",
  },
} as const;
