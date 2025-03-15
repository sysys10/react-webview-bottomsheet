import { useMemo } from "react";
import type { A11yProps, A11yReturnProps } from "../types";

/**
 * Hook to provide accessibility props for the bottom sheet
 *
 * @param props - Accessibility props
 * @returns An object containing ARIA and role attributes for accessibility
 */
export const useA11yProps = ({ id, visible }: A11yProps): A11yReturnProps => {
  return useMemo(() => {
    const baseId = id || "bottom-sheet";

    return {
      role: "dialog",
      "aria-modal": true,
      "aria-hidden": !visible,
      ...(id
        ? {
            id: baseId,
            "aria-labelledby": `${baseId}-title`,
          }
        : {}),
    };
  }, [id, visible]);
};
