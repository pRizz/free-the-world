import { ContentCard } from "~/components/blocks/content-card";
import { MetadataGrid } from "~/components/blocks/metadata-grid";
import { PageHeader } from "~/components/blocks/page-header";
import type { Company } from "~/lib/domain/types";
import { getIndustryLabel, getIndexLabels, getRegionLabel, getSectorLabel } from "~/lib/domain/selectors";

export function CompanyMetadataPanel(props: { company: Company }) {
  return (
    <ContentCard class="space-y-4">
      <PageHeader eyebrow="Metadata" title="Where this company sits" />
      <MetadataGrid
        items={[
          { label: "Ticker", value: props.company.ticker },
          { label: "Rank snapshot", value: `≈ ${props.company.rankApprox}` },
          { label: "Sector", value: getSectorLabel(props.company.sectorId) },
          { label: "Industry", value: getIndustryLabel(props.company.industryId) },
          { label: "Region", value: getRegionLabel(props.company.regionId) },
          { label: "Index", value: getIndexLabels(props.company.indexIds).join(", ") },
        ]}
      />
    </ContentCard>
  );
}
