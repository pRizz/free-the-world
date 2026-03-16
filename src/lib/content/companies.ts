import { deriveIpoMetrics } from "~/lib/domain/ipo";
import { calculateFreedCapitalPotential } from "~/lib/domain/scoring";
import type { Company, CompanyIpo, MetricAssessment } from "~/lib/domain/types";

const reviewedOn = "2026-03-14";
const snapshotNote =
  "Curated early-2026 public-source snapshot. Exact ordering can drift with the tape.";
type BaseCompanyMetricId =
  | "moat"
  | "decentralizability"
  | "profitability"
  | "peRatio"
  | "marketCap";

function assessment(
  value: number,
  rationale: string,
  sourceIds: string[],
  confidence: MetricAssessment["confidence"] = "medium",
): MetricAssessment {
  return {
    value,
    rationale,
    sourceIds,
    confidence,
    lastReviewedOn: reviewedOn,
  };
}

function uniqueSourceIds(...sourceIdLists: string[][]) {
  return [...new Set(sourceIdLists.flat())];
}

function ipo(
  date: string,
  dateSourceIds: string[],
  marketCapValue: number,
  rationale: string,
  sourceIds: string[],
  confidence: MetricAssessment["confidence"] = "medium",
): CompanyIpo {
  return {
    date,
    dateSourceIds,
    marketCap: assessment(marketCapValue, rationale, sourceIds, confidence),
  };
}

function buildCompany(
  company: Omit<Company, "metrics" | "snapshotNote"> & {
    baseMetrics: Record<BaseCompanyMetricId, MetricAssessment>;
  },
): Company {
  const freedCapitalPotential = calculateFreedCapitalPotential(
    company.baseMetrics.marketCap.value,
    company.baseMetrics.moat.value,
    company.baseMetrics.decentralizability.value,
    company.baseMetrics.profitability.value,
  );
  const ipoMetrics = deriveIpoMetrics(company.maybeIpo, company.baseMetrics.marketCap);
  const metrics: Company["metrics"] = {
    ...company.baseMetrics,
    ...ipoMetrics,
    freedCapitalPotential: assessment(
      freedCapitalPotential,
      "Derived from market cap, moat resistance, decentralizability, and profitability. It is a directional estimate of value capture that could come under pressure if open alternatives compound.",
      uniqueSourceIds(
        company.baseMetrics.marketCap.sourceIds,
        company.baseMetrics.decentralizability.sourceIds,
      ),
      "speculative",
    ),
  };

  return {
    ...company,
    snapshotNote,
    metrics,
  };
}

export const companies: Company[] = [
  buildCompany({
    slug: "nvidia",
    name: "NVIDIA",
    ticker: "NVDA",
    rankApprox: 1,
    maybeIpo: ipo(
      "1999-01-22",
      ["nvidia-ipo-prospectus"],
      332_444_856,
      "Computed from NVIDIA's $12.00 IPO price and 27,703,738 shares outstanding after the offering in the final prospectus.",
      ["nvidia-ipo-prospectus"],
      "high",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "information-technology",
    industryId: "semiconductors",
    companiesMarketCapUrl: "https://companiesmarketcap.com/nvidia/marketcap/",
    description: "GPU kingmaker for AI training, inference, gaming, and high-performance compute.",
    overview: [
      {
        title: "Accelerated compute, accelerated leverage",
        paragraphs: [
          "NVIDIA is where modern AI enthusiasm goes to buy silicon, networking, and software lock-in in one elegantly expensive bundle. The hardware is formidable; the CUDA gravity is arguably even more formidable.",
          "That combination makes NVIDIA one of the least immediately decentralizable businesses in the registry. Even if open software catches up, cutting-edge chip design and scarce manufacturing capacity are still not things most people can print in the garage next to the sourdough starter.",
        ],
      },
    ],
    moatNarrative: [
      "The moat is anchored by scarce leading-edge hardware, developer familiarity with CUDA, and data-center procurement patterns that reward incumbency.",
      "Even well-funded rivals still have to overcome not just silicon performance, but the habit loop of an ecosystem that already assumes NVIDIA first.",
    ],
    decentralizationNarrative: [
      "Portable compute stacks, decentralized GPU marketplaces, and AMD's ROCm prove the idea is not impossible.",
      "The harder truth is that the bottleneck is not only software. It is also fabs, packaging, power envelopes, and the dull but decisive brutality of supply chains.",
    ],
    productSlugs: ["nvidia-cuda", "nvidia-dgx"],
    sourceIds: [
      "nvidia-investor",
      "nvidia-data-center",
      "nvidia-cuda",
      "nvidia-marketcap",
      "nvidia-ipo-prospectus",
      "amd-rocm",
    ],
    technologyWaveIds: ["printed-electronics"],
    baseMetrics: {
      moat: assessment(
        9.6,
        "CUDA lock-in plus premium hardware and ecosystem depth make NVIDIA unusually hard to dislodge.",
        ["nvidia-cuda", "nvidia-data-center"],
        "high",
      ),
      decentralizability: assessment(
        2.5,
        "Alternative compute stacks exist, but cutting-edge GPU supply is still profoundly centralized.",
        ["amd-rocm", "nvidia-data-center"],
        "medium",
      ),
      profitability: assessment(
        9.7,
        "NVIDIA's profit power is elite because demand is intense and supply remains constrained.",
        ["nvidia-investor"],
        "medium",
      ),
      peRatio: assessment(
        61,
        "Approximate valuation snapshot reflecting high growth expectations and AI enthusiasm.",
        ["nvidia-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        4_300_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["nvidia-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "apple",
    name: "Apple",
    ticker: "AAPL",
    rankApprox: 2,
    maybeIpo: ipo(
      "1980-12-12",
      ["apple-ipo-prospectus"],
      1_192_737_304,
      "Computed from Apple's $22.00 IPO price and 54,215,332 shares outstanding after the offering in the final prospectus.",
      ["apple-ipo-prospectus"],
      "high",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "information-technology",
    industryId: "technology-hardware",
    companiesMarketCapUrl: "https://companiesmarketcap.com/apple/marketcap/",
    description: "A vertically integrated device and services empire built around the iPhone.",
    overview: [
      {
        title: "Luxury convenience with operating-system gravity",
        paragraphs: [
          "Apple's genius is not merely building good hardware. It is making the hardware, software, distribution, payments, storage, and accessories feel like one reassuringly expensive sentence.",
          "That is why Apple's decentralizability score stays low even though pieces of the stack have open substitutes. The substitutes are real; the integrated lifestyle wrapper is what keeps the margins singing.",
        ],
      },
    ],
    moatNarrative: [
      "Apple's moat combines brand, hardware integration, developer incentives, and app distribution control.",
      "Users are often not buying a device so much as renting psychological peace from the ecosystem.",
    ],
    decentralizationNarrative: [
      "Open mobile operating systems, self-hosted sync, and alternative app distribution all chip away at Apple's softest control surfaces.",
      "The problem is that very few of them arrive with the same gloss, support burden transfer, and social normalcy that Apple bundles into the sale.",
    ],
    productSlugs: ["apple-icloud", "apple-app-store"],
    sourceIds: [
      "apple-investor",
      "apple-iphone",
      "apple-services",
      "apple-marketcap",
      "apple-ipo-prospectus",
      "grapheneos",
      "nextcloud",
      "syncthing",
    ],
    technologyWaveIds: ["microfactories"],
    baseMetrics: {
      moat: assessment(
        9.3,
        "Apple benefits from device lock-in, brand power, and control over app and service distribution.",
        ["apple-investor", "apple-services"],
        "high",
      ),
      decentralizability: assessment(
        2.8,
        "Pieces of the stack can be replaced, but the integrated ecosystem remains unusually sticky.",
        ["grapheneos", "nextcloud", "syncthing"],
        "medium",
      ),
      profitability: assessment(
        9.1,
        "Apple converts ecosystem control into durable high-margin earnings.",
        ["apple-investor"],
        "high",
      ),
      peRatio: assessment(
        32,
        "Approximate valuation snapshot for a mature but highly profitable platform company.",
        ["apple-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        3_700_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["apple-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "microsoft",
    name: "Microsoft",
    ticker: "MSFT",
    rankApprox: 3,
    maybeIpo: ipo(
      "1986-03-13",
      ["microsoft-ipo-prospectus"],
      519_017_373,
      "Computed from Microsoft's $21.00 IPO price and 24,715,113 shares outstanding after the offering in the prospectus.",
      ["microsoft-ipo-prospectus"],
      "medium",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "information-technology",
    industryId: "software-cloud",
    companiesMarketCapUrl: "https://companiesmarketcap.com/microsoft/marketcap/",
    description:
      "Enterprise software and cloud infrastructure giant spanning productivity, developer platforms, and operating systems.",
    overview: [
      {
        title: "The office landlord of the enterprise century",
        paragraphs: [
          "Microsoft still captures a remarkable amount of value from being the default digital office, identity provider, and enterprise coordination fabric. It has quietly become a utilities company for knowledge work, albeit one with a much better slide deck.",
          "That makes it powerful but not invincible. A significant share of Microsoft's software surface area can be rebuilt, self-hosted, or swapped for open alternatives, even if doing so remains inconvenient enough to preserve the moat for now.",
        ],
      },
    ],
    moatNarrative: [
      "The moat is strongest where Microsoft controls organizational workflow, identity, procurement pathways, and default compatibility expectations.",
      "GitHub, Azure, and Microsoft 365 reinforce each other into a platform stack that feels safer to keep paying than to rethink.",
    ],
    decentralizationNarrative: [
      "Productivity, version control, storage, and even cloud layers all have credible open or self-hosted alternatives.",
      "The decentralization challenge is cultural and operational more than technical: Microsoft monetizes institutional inertia with exceptional discipline.",
    ],
    productSlugs: ["microsoft-365-suite", "microsoft-github"],
    sourceIds: [
      "microsoft-investor",
      "microsoft-365",
      "azure",
      "microsoft-marketcap",
      "microsoft-ipo-prospectus",
      "libreoffice",
      "gitea",
      "nextcloud",
    ],
    technologyWaveIds: ["bitcoin-native-coordination"],
    baseMetrics: {
      moat: assessment(
        9.1,
        "Enterprise defaults, compliance comfort, and deeply embedded workflow software make Microsoft durable.",
        ["microsoft-investor", "azure"],
        "high",
      ),
      decentralizability: assessment(
        6.4,
        "Open productivity, git hosting, and private cloud tooling are credible enough to create real replacement pressure.",
        ["libreoffice", "gitea", "openstack"],
        "medium",
      ),
      profitability: assessment(
        9.5,
        "Microsoft monetizes distribution, enterprise trust, and cloud scale with unusual consistency.",
        ["microsoft-investor"],
        "high",
      ),
      peRatio: assessment(
        36,
        "Approximate valuation snapshot reflecting durable growth and margin quality.",
        ["microsoft-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        3_300_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["microsoft-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "alphabet",
    name: "Alphabet",
    ticker: "GOOGL",
    rankApprox: 4,
    maybeIpo: ipo(
      "2004-08-19",
      ["alphabet-ipo-prospectus"],
      23_053_669_655,
      "Computed from Google's $85.00 IPO price and 271,219,643 total common shares outstanding after the offering in the final prospectus.",
      ["alphabet-ipo-prospectus"],
      "high",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "communication-services",
    industryId: "interactive-media-services",
    companiesMarketCapUrl: "https://companiesmarketcap.com/alphabet-google/marketcap/",
    description:
      "Search, ads, video, mobile, and cloud giant still centered economically on attention capture.",
    overview: [
      {
        title: "The empire of default answers",
        paragraphs: [
          "Alphabet is a reminder that a search box can turn into an economic continent if enough adjacent products quietly feed it users, data, and ad inventory.",
          "Unlike hardware-heavy empires, much of Alphabet's surface area is theoretically reproducible with open software and protocols. The challenge is that reproducing the data flywheel, distribution, and ad-market depth is harder than reproducing the software itself.",
        ],
      },
    ],
    moatNarrative: [
      "Search quality, ad-market liquidity, distribution via Android and browsers, and YouTube's audience scale keep Alphabet resilient.",
      "The moat is partly product quality and partly the advantage of already being where the world's queries and creators congregate.",
    ],
    decentralizationNarrative: [
      "Search aggregation, federated video, and de-Googled Android all create real cracks in the story that Google's stack is irreplaceable.",
      "Still, open alternatives often struggle exactly where Google is strongest: defaults, reach, and advertiser convenience.",
    ],
    productSlugs: ["google-search", "youtube"],
    sourceIds: [
      "alphabet-investor",
      "google-products",
      "google-cloud",
      "alphabet-marketcap",
      "alphabet-ipo-prospectus",
      "searxng",
      "peertube",
    ],
    technologyWaveIds: ["bitcoin-native-coordination"],
    baseMetrics: {
      moat: assessment(
        8.7,
        "Google's search and ad ecosystem is extremely entrenched, though less physically rooted than hardware moats.",
        ["alphabet-investor", "google-products"],
        "high",
      ),
      decentralizability: assessment(
        6.8,
        "Open search, federated media, and de-Googled mobile stacks create meaningful replacement paths.",
        ["searxng", "peertube"],
        "medium",
      ),
      profitability: assessment(
        8.8,
        "Alphabet still turns defaults and ad infrastructure into enormous profit streams.",
        ["alphabet-investor"],
        "high",
      ),
      peRatio: assessment(
        26,
        "Approximate valuation snapshot for a mature ad-and-cloud platform.",
        ["alphabet-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        2_400_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["alphabet-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "amazon",
    name: "Amazon",
    ticker: "AMZN",
    rankApprox: 5,
    maybeIpo: ipo(
      "1997-05-15",
      ["amazon-ipo-prospectus"],
      429_456_636,
      "Computed from Amazon's $18.00 IPO price and 23,858,702 shares outstanding after the offering in the final prospectus.",
      ["amazon-ipo-prospectus"],
      "high",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "consumer-discretionary",
    industryId: "broadline-retail",
    companiesMarketCapUrl: "https://companiesmarketcap.com/amazon/marketcap/",
    description:
      "Retail, logistics, advertising, and cloud juggernaut with scale in both atoms and bits.",
    overview: [
      {
        title: "Cloud on one side, cardboard domination on the other",
        paragraphs: [
          "Amazon is really two giant coordination systems stapled together: one for cloud infrastructure and one for moving physical goods with almost suspicious efficiency.",
          "The software-heavy side of Amazon is decentralizable enough to worry about. The logistics-heavy side is much harder. The result is a company whose vulnerability varies sharply by product line rather than by slogan.",
        ],
      },
    ],
    moatNarrative: [
      "Amazon's moat comes from fulfillment density, merchant dependence, Prime habits, and AWS being embedded in modern software stacks.",
      "A great deal of the value resides in operations rather than just interface polish, which is usually where disruption becomes less theatrical and more expensive.",
    ],
    decentralizationNarrative: [
      "Cloud primitives, e-commerce software, and marketplace tooling are highly reproducible compared with Amazon's logistics machine.",
      "Distributed manufacturing and local commerce networks matter most where they can bypass the need for Amazon's scale altogether instead of imitating it directly.",
    ],
    productSlugs: ["aws-platform", "amazon-marketplace"],
    sourceIds: [
      "amazon-investor",
      "amazon-store",
      "aws",
      "amazon-marketcap",
      "amazon-ipo-prospectus",
      "openstack",
      "minio",
      "akash",
    ],
    technologyWaveIds: ["microfactories", "bitcoin-native-coordination"],
    baseMetrics: {
      moat: assessment(
        8.9,
        "Amazon's operational density and AWS standardization create a wide, two-headed moat.",
        ["amazon-investor", "aws"],
        "high",
      ),
      decentralizability: assessment(
        5.7,
        "Open cloud tooling and local commerce stacks create pressure, but logistics scale remains difficult to distribute.",
        ["openstack", "akash", "minio"],
        "medium",
      ),
      profitability: assessment(
        7.6,
        "Amazon's profit engine is improving, but it is still less pristine than the pure software aristocracy.",
        ["amazon-investor"],
        "medium",
      ),
      peRatio: assessment(
        36,
        "Approximate valuation snapshot reflecting cloud and advertising growth expectations.",
        ["amazon-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        2_200_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["amazon-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "meta-platforms",
    name: "Meta Platforms",
    ticker: "META",
    rankApprox: 6,
    maybeIpo: ipo(
      "2012-05-18",
      ["meta-ipo-prospectus"],
      81_247_231_406,
      "Computed from Meta's $38.00 IPO price in the final prospectus and 2,138,085,037 total Class A and Class B shares outstanding after the IPO in Amendment No. 8 to the registration statement.",
      ["meta-ipo-prospectus", "meta-ipo-registration"],
      "high",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "communication-services",
    industryId: "interactive-media-services",
    companiesMarketCapUrl: "https://companiesmarketcap.com/meta-platforms/marketcap/",
    description:
      "Ad-supported social and messaging empire anchored by Facebook, Instagram, and WhatsApp.",
    overview: [
      {
        title: "Network effects wearing designer casual",
        paragraphs: [
          "Meta's core power is not that social media is impossible to copy. It is that people still prefer congregating where other people already are, even when they complain about the landlord continuously.",
          "That keeps Meta's moat meaningful but makes its decentralization risk unusually visible. Social publishing, messaging, and creator distribution are exactly the categories where protocols and federated systems can plausibly chip away at incumbents over time.",
        ],
      },
    ],
    moatNarrative: [
      "Meta's strongest asset is social graph density and the ad machine built on top of that attention.",
      "Its lock-in is real, but it is more behavioral than infrastructural, which usually means disruption starts as migration at the edges.",
    ],
    decentralizationNarrative: [
      "ActivityPub, federated photo sharing, and open messaging stacks make Meta one of the easier mega-caps to imagine being slowly unbundled.",
      "The difficulty is less technical architecture than the sheer inertia of habit, creators, and ad buyers.",
    ],
    productSlugs: ["instagram", "whatsapp-platform"],
    sourceIds: [
      "meta-investor",
      "meta-tech",
      "whatsapp",
      "meta-marketcap",
      "meta-ipo-prospectus",
      "meta-ipo-registration",
      "mastodon",
      "pixelfed",
      "matrix",
    ],
    technologyWaveIds: ["bitcoin-native-coordination"],
    baseMetrics: {
      moat: assessment(
        7.9,
        "Meta's social graph and ad targeting moat is strong but more culturally reversible than deep infrastructure moats.",
        ["meta-investor", "meta-tech"],
        "medium",
      ),
      decentralizability: assessment(
        7.4,
        "Federated social and open messaging create unusually clear alternative pathways.",
        ["mastodon", "pixelfed", "matrix"],
        "medium",
      ),
      profitability: assessment(
        8.6,
        "Meta remains deeply profitable thanks to attention capture and ad-market scale.",
        ["meta-investor"],
        "high",
      ),
      peRatio: assessment(
        28,
        "Approximate valuation snapshot for a high-margin ad platform.",
        ["meta-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        1_800_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["meta-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "broadcom",
    name: "Broadcom",
    ticker: "AVGO",
    rankApprox: 7,
    maybeIpo: ipo(
      "2009-08-06",
      ["broadcom-ipo-prospectus"],
      3_538_323_045,
      "Computed from Avago's $15.00 IPO price and 235,888,203 shares outstanding immediately after the offering in the final prospectus.",
      ["broadcom-ipo-prospectus"],
      "high",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "information-technology",
    industryId: "semiconductors",
    companiesMarketCapUrl: "https://companiesmarketcap.com/broadcom/marketcap/",
    description:
      "Semiconductor and infrastructure software consolidator with critical exposure to networking and virtualization.",
    overview: [
      {
        title: "Where chips meet enterprise rent extraction",
        paragraphs: [
          "Broadcom is an awkwardly elegant example of two different moat types living under one roof: hard-to-replicate semiconductor supply chains and highly monetizable enterprise software lock-in.",
          "That split makes Broadcom less decentralizable than software vendors but more vulnerable than a pure semiconductor titan in specific categories like VMware-era virtualization.",
        ],
      },
    ],
    moatNarrative: [
      "Broadcom's moat comes from custom silicon relationships, networking relevance, and a willingness to monetize mission-critical software with all the tenderness of a spreadsheet.",
      "Customers may dislike the pricing; they also tend to dislike downtime, which is usually what preserves the margin.",
    ],
    decentralizationNarrative: [
      "The software side is replaceable in pockets. The semiconductor side is much less so.",
      "That makes Broadcom a mixed case: some value capture looks structurally durable, while some looks like a generous invitation for Proxmox and friends.",
    ],
    productSlugs: ["vmware-vsphere", "broadcom-networking"],
    sourceIds: [
      "broadcom-investor",
      "vmware",
      "broadcom-home",
      "broadcom-marketcap",
      "broadcom-ipo-prospectus",
      "proxmox",
      "openstack",
    ],
    technologyWaveIds: ["printed-electronics"],
    baseMetrics: {
      moat: assessment(
        8.6,
        "Broadcom combines hard-to-replicate hardware supply with entrenched enterprise software footprints.",
        ["broadcom-investor", "vmware"],
        "high",
      ),
      decentralizability: assessment(
        3.8,
        "Virtualization can be displaced more readily than Broadcom's semiconductor relevance.",
        ["proxmox", "openstack"],
        "medium",
      ),
      profitability: assessment(
        8.9,
        "The company has both pricing power and critical infrastructure exposure.",
        ["broadcom-investor"],
        "high",
      ),
      peRatio: assessment(
        50,
        "Approximate valuation snapshot reflecting AI and infrastructure enthusiasm.",
        ["broadcom-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        1_100_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["broadcom-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "tesla",
    name: "Tesla",
    ticker: "TSLA",
    rankApprox: 8,
    maybeIpo: ipo(
      "2010-06-29",
      ["tesla-ipo-prospectus"],
      1_582_859_681,
      "Computed from Tesla's $17.00 IPO price and 93,109,393 shares outstanding after the offering and concurrent private placement in the final prospectus.",
      ["tesla-ipo-prospectus"],
      "high",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "consumer-discretionary",
    industryId: "automobile-manufacturers",
    companiesMarketCapUrl: "https://companiesmarketcap.com/tesla/marketcap/",
    description:
      "EV, charging, energy storage, and autonomy company that sells both products and future narratives.",
    overview: [
      {
        title: "A car company, an energy company, and occasionally a mood board",
        paragraphs: [
          "Tesla deserves credit for forcing the auto industry to move faster. It also benefits from investors repeatedly pricing future software leverage into a business that still has to weld metal and navigate regulators.",
          "That mix keeps Tesla in the middle of the decentralizability spectrum. Open charging, home energy management, and driver-assistance tooling can nibble at the software/control layer. Car manufacturing remains stubbornly physical and regulated.",
        ],
      },
    ],
    moatNarrative: [
      "Tesla's moat rests on brand, battery and manufacturing iteration speed, charging infrastructure, and the promise of software differentiation.",
      "Some of that moat is hard industrial reality. Some of it is narrative premium, which is not the same thing but does occasionally pay just as well.",
    ],
    decentralizationNarrative: [
      "Charging standards, energy management, and autonomy-adjacent tooling are much more openable than vehicle manufacturing itself.",
      "Distributed energy tech also matters here: if household and community energy stacks become more modular, Tesla's control surface may narrow.",
    ],
    productSlugs: ["tesla-supercharger", "tesla-energy-stack"],
    sourceIds: [
      "tesla-investor",
      "tesla-modely",
      "tesla-energy",
      "tesla-marketcap",
      "tesla-ipo-prospectus",
      "openpilot",
      "openevse",
      "openems",
    ],
    technologyWaveIds: ["distributed-energy", "microfactories"],
    baseMetrics: {
      moat: assessment(
        7.4,
        "Tesla has brand and infrastructure advantages, but much of the category remains contestable.",
        ["tesla-investor", "tesla-energy"],
        "medium",
      ),
      decentralizability: assessment(
        5.9,
        "Charging and energy layers are openable, while vehicle manufacturing remains centralized.",
        ["openevse", "openems", "openpilot"],
        "medium",
      ),
      profitability: assessment(
        5.8,
        "Tesla is profitable but less predictably so than the platform-heavy names above it.",
        ["tesla-investor"],
        "medium",
      ),
      peRatio: assessment(
        70,
        "Approximate valuation snapshot reflecting very high future expectations.",
        ["tesla-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        1_000_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["tesla-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "berkshire-hathaway",
    name: "Berkshire Hathaway",
    ticker: "BRK.B",
    rankApprox: 9,
    maybeIpo: null,
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "financials",
    industryId: "multi-sector-holdings",
    companiesMarketCapUrl: "https://companiesmarketcap.com/berkshire-hathaway/marketcap/",
    description:
      "Conglomerate spanning insurance, rail, utilities, manufacturing, and a massive equity portfolio.",
    overview: [
      {
        title: "A portfolio of very non-theoretical assets",
        paragraphs: [
          "Berkshire is what happens when capital allocation becomes a superpower and then spends decades buying regulated, asset-heavy, occasionally glorious real-world businesses.",
          "That reality makes Berkshire one of the least decentralizable names in the registry. You can open-source a workflow. You cannot casually federate a continental rail network or patch in a community-run clone of a giant insurance float overnight.",
        ],
      },
    ],
    moatNarrative: [
      "Berkshire's moat is diversification, regulatory entrenchment, asset scale, and balance-sheet flexibility.",
      "It does not rely on one magical product. It relies on owning a great many large, boring, durable things all at once.",
    ],
    decentralizationNarrative: [
      "Some adjacent layers, such as community energy, mutual insurance structures, and local infrastructure governance, matter at the margins.",
      "The core businesses remain capital-intensive, regulated, and geographically rooted, which keeps decentralization pressure low for now.",
    ],
    productSlugs: ["geico-insurance", "berkshire-energy"],
    sourceIds: [
      "berkshire-home",
      "berkshire-reports",
      "geico",
      "bnsf",
      "berkshire-marketcap",
      "openems",
    ],
    technologyWaveIds: ["distributed-energy"],
    baseMetrics: {
      moat: assessment(
        8.8,
        "Insurance float, regulated assets, and operational breadth give Berkshire serious staying power.",
        ["berkshire-reports", "geico", "bnsf"],
        "high",
      ),
      decentralizability: assessment(
        1.9,
        "Most of Berkshire's core businesses are not software-shaped enough to decentralize quickly.",
        ["berkshire-home", "bnsf"],
        "medium",
      ),
      profitability: assessment(
        8.1,
        "Berkshire remains a high-quality allocator and owner of durable earnings streams.",
        ["berkshire-reports"],
        "high",
      ),
      peRatio: assessment(
        14,
        "Approximate valuation snapshot for a diversified asset-heavy compounder.",
        ["berkshire-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        900_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["berkshire-marketcap"],
        "medium",
      ),
    },
  }),
  buildCompany({
    slug: "walmart",
    name: "Walmart",
    ticker: "WMT",
    rankApprox: 10,
    maybeIpo: ipo(
      "1970-10-01",
      ["walmart-stock-split-history"],
      21_450_000,
      "Computed from Walmart's $16.50 IPO price on October 1, 1970 and the SEC News Digest note that 1,300,000 common shares would be outstanding after the offering.",
      ["walmart-stock-split-history", "walmart-ipo-digest"],
      "medium",
    ),
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "consumer-staples",
    industryId: "consumer-staples-retail",
    companiesMarketCapUrl: "https://companiesmarketcap.com/walmart/marketcap/",
    description:
      "Scale retail and grocery giant whose moat lives in sourcing, logistics, and physical footprint.",
    overview: [
      {
        title: "The case for cheaper groceries, at industrial scale",
        paragraphs: [
          "Walmart's core advantage is not a mysterious algorithm. It is the relentless competence of procurement, distribution, and operating at a scale that makes smaller players sweat in barcodes.",
          "That means Walmart is not especially easy to decentralize directly. Still, local manufacturing, cooperative marketplaces, and regional supply chains could all pressure portions of its value capture where convenience currently benefits from concentration rather than necessity.",
        ],
      },
    ],
    moatNarrative: [
      "Walmart's moat is store density, distribution efficiency, supplier leverage, and the still underrated magic trick of moving mundane goods cheaply and reliably.",
      "Software helps, but the moat remains mostly physical and operational rather than purely digital.",
    ],
    decentralizationNarrative: [
      "Retail software can be replaced. The physical network is harder.",
      "Distributed manufacturing, cooperative commerce, and more localized fulfillment matter most where they reduce dependence on giant centralized intermediaries rather than imitate them perfectly.",
    ],
    productSlugs: ["walmart-marketplace", "walmart-grocery"],
    sourceIds: [
      "walmart-investor",
      "walmart-store",
      "walmart-about",
      "walmart-marketcap",
      "walmart-stock-split-history",
      "walmart-ipo-digest",
      "open-food-network",
    ],
    technologyWaveIds: ["microfactories", "additive-manufacturing"],
    baseMetrics: {
      moat: assessment(
        8.2,
        "Walmart's physical scale and procurement leverage are deeply entrenched.",
        ["walmart-investor", "walmart-about"],
        "high",
      ),
      decentralizability: assessment(
        4.4,
        "Open marketplace tooling and local production can attack parts of the model, but not the entire logistics machine.",
        ["open-food-network", "walmart-store"],
        "medium",
      ),
      profitability: assessment(
        6.4,
        "Walmart's economics are strong because of scale, even if retail margins are not glamorous.",
        ["walmart-investor"],
        "medium",
      ),
      peRatio: assessment(
        38,
        "Approximate valuation snapshot reflecting defensive scale and market optimism.",
        ["walmart-marketcap"],
        "speculative",
      ),
      marketCap: assessment(
        800_000_000_000,
        "Approximate market cap snapshot from public market trackers.",
        ["walmart-marketcap"],
        "medium",
      ),
    },
  }),
];
