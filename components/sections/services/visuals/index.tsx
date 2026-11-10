import type { ComponentType } from "react";
import type { ServiceVisual as VisualKey } from "@/lib/content";
import { BrandingVisual, MarketingVisual, SeoVisual, WebsiteVisual } from "./presence-growth";
import { AutomationVisual, ConsultancyVisual, CrmVisual, ErpVisual } from "./technology-systems";

const visuals: Record<VisualKey, ComponentType> = {
  website: WebsiteVisual,
  branding: BrandingVisual,
  marketing: MarketingVisual,
  seo: SeoVisual,
  consultancy: ConsultancyVisual,
  automation: AutomationVisual,
  crm: CrmVisual,
  erp: ErpVisual,
};

/** Server-rendered illustrative composition for a service. */
export function ServiceVisual({ visual }: { visual: VisualKey }) {
  const Visual = visuals[visual];
  return <Visual />;
}
