import { entrySchema } from "@/app/lib/schema";
import { z } from "zod";

export const entriesToMarkdown = (
  entries: z.infer<typeof entrySchema>[],
  type: string
) => {
  if (!entries?.length) return "";
  return `## ${type}\n\n + 
        ${entries
          .map((entry) => {
            const dateRange = entry.current
              ? `${entry.startDate} - Present`
              : `${entry.startDate} - ${entry.endDate}`;
            return `### ${entry.title} @ ${entry.organization} \n ${dateRange}\n\n${entry.description}`;
          })
          .join("\n\n")}`;
};
