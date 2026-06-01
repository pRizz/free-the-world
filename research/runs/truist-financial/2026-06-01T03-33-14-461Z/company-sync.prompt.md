You are preparing a publishable JSON refresh for the Free The World registry.

Company slug: truist-financial

Manifest:
```json
{
  "schemaVersion": 1,
  "slug": "truist-financial",
  "name": "Truist Financial",
  "ticker": "TFC",
  "regionId": "us",
  "indexIds": [
    "sp500-top200"
  ],
  "sectorId": "financials",
  "industryId": "diversified-banks",
  "companiesMarketCapUrl": "https://companiesmarketcap.com/truist-financial/marketcap/",
  "description": "Truist Financial is a U.S. bank holding company offering consumer, commercial, wealth, insurance, and corporate banking services.",
  "technologyWaveIds": [],
  "seedProductNames": [
    "Truist One Checking",
    "Truist Wealth"
  ],
  "seedSourceUrls": [
    "https://www.truist.com/",
    "https://ir.truist.com/",
    "https://companiesmarketcap.com/truist-financial/marketcap/"
  ],
  "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
}
```

Current bundle (may be null for new companies):
```json
null
```

Current referenced sources:
```json
[]
```

Available taxonomy:
```json
{
  "regions": [
    {
      "id": "us",
      "label": "United States"
    }
  ],
  "indices": [
    {
      "id": "sp500-top10",
      "label": "S&P 500 · Top 10 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of the ten largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top20",
      "label": "S&P 500 · Top 20 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of the twenty largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top25",
      "label": "S&P 500 · Top 25 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of the twenty-five largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top35",
      "label": "S&P 500 · Top 35 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of ranks 26-35 in an expansion toward the thirty-five largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top50",
      "label": "S&P 500 · Top 50 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of the fifty largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top75",
      "label": "S&P 500 · Top 75 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of ranks 51-75 in an expansion toward the seventy-five largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top100",
      "label": "S&P 500 · Top 100 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of ranks 76-100 in an expansion toward the one hundred largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top125",
      "label": "S&P 500 · Top 125 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of ranks 101-125 in an expansion toward the one hundred twenty-five largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top150",
      "label": "S&P 500 · Top 150 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of ranks 126-150 in an expansion toward the one hundred fifty largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top175",
      "label": "S&P 500 · Top 175 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of ranks 151-175 in an expansion toward the one hundred seventy-five largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top200",
      "label": "S&P 500 · Top 200 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of ranks 176-200 in an expansion toward the two hundred largest S&P 500 constituents by market capitalization."
    }
  ],
  "sectors": [
    {
      "id": "information-technology",
      "label": "Information Technology"
    },
    {
      "id": "communication-services",
      "label": "Communication Services"
    },
    {
      "id": "consumer-discretionary",
      "label": "Consumer Discretionary"
    },
    {
      "id": "financials",
      "label": "Financials"
    },
    {
      "id": "consumer-staples",
      "label": "Consumer Staples"
    },
    {
      "id": "health-care",
      "label": "Health Care"
    },
    {
      "id": "energy",
      "label": "Energy"
    },
    {
      "id": "industrials",
      "label": "Industrials"
    },
    {
      "id": "materials",
      "label": "Materials"
    },
    {
      "id": "utilities",
      "label": "Utilities"
    },
    {
      "id": "real-estate",
      "label": "Real Estate"
    }
  ],
  "industries": [
    {
      "id": "semiconductors",
      "sectorId": "information-technology",
      "label": "Semiconductors"
    },
    {
      "id": "technology-hardware",
      "sectorId": "information-technology",
      "label": "Technology Hardware, Storage & Peripherals"
    },
    {
      "id": "software-cloud",
      "sectorId": "information-technology",
      "label": "Software & Cloud Platforms"
    },
    {
      "id": "interactive-media-services",
      "sectorId": "communication-services",
      "label": "Interactive Media & Services"
    },
    {
      "id": "broadline-retail",
      "sectorId": "consumer-discretionary",
      "label": "Broadline Retail"
    },
    {
      "id": "automobile-manufacturers",
      "sectorId": "consumer-discretionary",
      "label": "Automobile Manufacturers"
    },
    {
      "id": "home-improvement-retail",
      "sectorId": "consumer-discretionary",
      "label": "Home Improvement Retail"
    },
    {
      "id": "multi-sector-holdings",
      "sectorId": "financials",
      "label": "Multi-Sector Holdings"
    },
    {
      "id": "consumer-staples-retail",
      "sectorId": "consumer-staples",
      "label": "Consumer Staples Distribution & Retail"
    },
    {
      "id": "diversified-banks",
      "sectorId": "financials",
      "label": "Diversified Banks"
    },
    {
      "id": "capital-markets",
      "sectorId": "financials",
      "label": "Capital Markets"
    },
    {
      "id": "pharmaceuticals",
      "sectorId": "health-care",
      "label": "Pharmaceuticals"
    },
    {
      "id": "managed-health-care",
      "sectorId": "health-care",
      "label": "Managed Health Care"
    },
    {
      "id": "payment-networks",
      "sectorId": "financials",
      "label": "Payment Networks"
    },
    {
      "id": "warehouse-clubs",
      "sectorId": "consumer-staples",
      "label": "Warehouse Clubs"
    },
    {
      "id": "household-products",
      "sectorId": "consumer-staples",
      "label": "Household Products"
    },
    {
      "id": "integrated-oil-gas",
      "sectorId": "energy",
      "label": "Integrated Oil & Gas"
    },
    {
      "id": "oil-gas-refining-marketing",
      "sectorId": "energy",
      "label": "Oil & Gas Refining & Marketing"
    },
    {
      "id": "streaming-video",
      "sectorId": "communication-services",
      "label": "Streaming Video"
    },
    {
      "id": "pharma-medtech",
      "sectorId": "health-care",
      "label": "Pharma & MedTech"
    },
    {
      "id": "nonalcoholic-beverages",
      "sectorId": "consumer-staples",
      "label": "Non-Alcoholic Beverages"
    },
    {
      "id": "construction-machinery",
      "sectorId": "industrials",
      "label": "Construction & Farm Machinery"
    },
    {
      "id": "aerospace-defense",
      "sectorId": "industrials",
      "label": "Aerospace & Defense"
    },
    {
      "id": "electrical-equipment",
      "sectorId": "industrials",
      "label": "Electrical Equipment & Grid Technology"
    },
    {
      "id": "communications-equipment",
      "sectorId": "information-technology",
      "label": "Communications Equipment"
    },
    {
      "id": "wireless-telecom",
      "sectorId": "communication-services",
      "label": "Wireless Telecommunications"
    },
    {
      "id": "tobacco",
      "sectorId": "consumer-staples",
      "label": "Tobacco"
    },
    {
      "id": "semiconductor-equipment",
      "sectorId": "information-technology",
      "label": "Semiconductor Equipment"
    },
    {
      "id": "industrial-gases",
      "sectorId": "materials",
      "label": "Industrial Gases"
    },
    {
      "id": "restaurants",
      "sectorId": "consumer-discretionary",
      "label": "Restaurants"
    },
    {
      "id": "electric-utilities",
      "sectorId": "utilities",
      "label": "Electric Utilities"
    },
    {
      "id": "entertainment",
      "sectorId": "communication-services",
      "label": "Entertainment"
    },
    {
      "id": "apparel-retail",
      "sectorId": "consumer-discretionary",
      "label": "Apparel Retail"
    },
    {
      "id": "life-sciences-tools-services",
      "sectorId": "health-care",
      "label": "Life Sciences Tools & Services"
    },
    {
      "id": "electronic-components",
      "sectorId": "information-technology",
      "label": "Electronic Components"
    },
    {
      "id": "rail-transportation",
      "sectorId": "industrials",
      "label": "Rail Transportation"
    },
    {
      "id": "passenger-ground-transportation",
      "sectorId": "industrials",
      "label": "Passenger Ground Transportation & Mobility Platforms"
    },
    {
      "id": "local-commerce-delivery-platforms",
      "sectorId": "consumer-discretionary",
      "label": "Local Commerce & Delivery Platforms"
    },
    {
      "id": "health-care-reits",
      "sectorId": "real-estate",
      "label": "Health Care REITs"
    },
    {
      "id": "industrial-conglomerates",
      "sectorId": "industrials",
      "label": "Industrial Conglomerates"
    },
    {
      "id": "oil-gas-exploration-production",
      "sectorId": "energy",
      "label": "Oil & Gas Exploration & Production"
    },
    {
      "id": "industrial-reits",
      "sectorId": "real-estate",
      "label": "Industrial REITs"
    },
    {
      "id": "travel-services",
      "sectorId": "consumer-discretionary",
      "label": "Travel Services"
    },
    {
      "id": "cruise-lines",
      "sectorId": "consumer-discretionary",
      "label": "Cruise Lines"
    },
    {
      "id": "property-casualty-insurance",
      "sectorId": "financials",
      "label": "Property & Casualty Insurance"
    },
    {
      "id": "gold-mining",
      "sectorId": "materials",
      "label": "Gold Mining"
    },
    {
      "id": "it-consulting-services",
      "sectorId": "information-technology",
      "label": "IT Consulting & Services"
    },
    {
      "id": "industrial-machinery",
      "sectorId": "industrials",
      "label": "Industrial Machinery"
    },
    {
      "id": "construction-engineering",
      "sectorId": "industrials",
      "label": "Construction & Engineering"
    },
    {
      "id": "commercial-services-supplies",
      "sectorId": "industrials",
      "label": "Commercial Services & Supplies"
    },
    {
      "id": "financial-exchanges-data",
      "sectorId": "financials",
      "label": "Financial Exchanges & Data"
    },
    {
      "id": "consumer-finance",
      "sectorId": "financials",
      "label": "Consumer Finance"
    },
    {
      "id": "health-care-distributors",
      "sectorId": "health-care",
      "label": "Health Care Distributors"
    },
    {
      "id": "health-care-facilities",
      "sectorId": "health-care",
      "label": "Health Care Facilities"
    },
    {
      "id": "cable-broadband-telecom",
      "sectorId": "communication-services",
      "label": "Cable, Broadband & Telecommunications"
    },
    {
      "id": "oil-gas-midstream",
      "sectorId": "energy",
      "label": "Oil & Gas Midstream"
    },
    {
      "id": "data-center-reits",
      "sectorId": "real-estate",
      "label": "Data Center REITs"
    },
    {
      "id": "hotels-resorts-lodging",
      "sectorId": "consumer-discretionary",
      "label": "Hotels, Resorts & Lodging"
    },
    {
      "id": "insurance-brokers",
      "sectorId": "financials",
      "label": "Insurance Brokers"
    },
    {
      "id": "air-freight-logistics",
      "sectorId": "industrials",
      "label": "Air Freight & Logistics"
    },
    {
      "id": "biotechnology",
      "sectorId": "health-care",
      "label": "Biotechnology"
    },
    {
      "id": "copper-diversified-metals",
      "sectorId": "materials",
      "label": "Copper & Diversified Metals"
    },
    {
      "id": "waste-management-services",
      "sectorId": "industrials",
      "label": "Waste Management & Environmental Services"
    },
    {
      "id": "building-products-controls",
      "sectorId": "industrials",
      "label": "Building Products, Controls & Automation"
    },
    {
      "id": "oil-gas-equipment-services",
      "sectorId": "energy",
      "label": "Oil & Gas Equipment & Services"
    },
    {
      "id": "telecom-tower-reits",
      "sectorId": "real-estate",
      "label": "Telecom Tower REITs"
    },
    {
      "id": "packaged-foods",
      "sectorId": "consumer-staples",
      "label": "Packaged Foods"
    },
    {
      "id": "specialty-chemicals-coatings",
      "sectorId": "materials",
      "label": "Specialty Chemicals & Coatings"
    },
    {
      "id": "automotive-parts-retail",
      "sectorId": "consumer-discretionary",
      "label": "Automotive Parts Retail"
    },
    {
      "id": "commercial-vehicle-manufacturers",
      "sectorId": "industrials",
      "label": "Commercial Vehicle Manufacturers"
    },
    {
      "id": "life-insurance",
      "sectorId": "financials",
      "label": "Life & Health Insurance"
    },
    {
      "id": "steel",
      "sectorId": "materials",
      "label": "Steel"
    },
    {
      "id": "retail-reits",
      "sectorId": "real-estate",
      "label": "Retail REITs"
    },
    {
      "id": "passenger-airlines",
      "sectorId": "industrials",
      "label": "Passenger Airlines"
    },
    {
      "id": "self-storage-reits",
      "sectorId": "real-estate",
      "label": "Self-Storage REITs"
    }
  ],
  "technologyWaves": [
    {
      "id": "additive-manufacturing",
      "label": "Additive manufacturing",
      "summary": "3D plastic and metal printing keep collapsing the minimum viable factory into something much smaller, cheaper, and more local.",
      "implications": [
        "Hardware moats tied to long-tail spare parts and custom enclosures should weaken over time.",
        "Localized production improves resilience for niche components and repair ecosystems.",
        "Software plus design-file control can become as important as physical inventory control."
      ]
    },
    {
      "id": "printed-electronics",
      "label": "Printed electronics and PCB tooling",
      "summary": "PCB fabrication, chip packaging, and increasingly automated electronics assembly continue shrinking the distance between prototype and local production.",
      "implications": [
        "Incumbents with hardware lock-in should be evaluated against a future of much cheaper custom electronics.",
        "Pick-and-place automation lowers the coordination cost for distributed manufacturing cells.",
        "The most durable hardware moats may migrate toward fabs, ecosystems, and compliance rather than assembly itself."
      ]
    },
    {
      "id": "microfactories",
      "label": "Microfactories and automated mini-home production",
      "summary": "Small, software-defined manufacturing cells could make localized production less eccentric and more default.",
      "implications": [
        "Products with heavy branding but generic bill-of-materials profiles look increasingly vulnerable.",
        "Logistics moats still matter, but their margin for arrogance should narrow.",
        "Open-source production recipes can pressure both price and product differentiation."
      ]
    },
    {
      "id": "distributed-energy",
      "label": "Printable solar, localized wind, and home energy stacks",
      "summary": "Cheaper distributed generation and better local energy management create more openings for community-scale infrastructure and self-custodied resilience.",
      "implications": [
        "Energy-related products should be viewed through interoperability and open-control surfaces.",
        "Battery, charging, and home automation layers are increasingly separable from single-vendor stacks.",
        "Incumbents that depend on closed energy ecosystems may look less inevitable over time."
      ]
    },
    {
      "id": "bitcoin-native-coordination",
      "label": "Bitcoin and Lightning as coordination rails",
      "summary": "Proof-of-work economics, programmable payment flows, and anti-spam pricing make more digital systems capable of rewarding signal while resisting abuse.",
      "implications": [
        "Platforms that monetize gatekeeping could face pressure from protocol-native payment and reputation layers.",
        "Micropayments can replace some ad-funded or subscription-heavy distribution models.",
        "Open systems with credible anti-spam economics deserve a higher decentralizability score than legacy software assumptions suggest."
      ]
    }
  ],
  "conceptAngles": [
    {
      "id": "bitcoin",
      "label": "Bitcoin",
      "summary": "Uses Bitcoin as a base layer for ownership, settlement, or economic alignment."
    },
    {
      "id": "lightning",
      "label": "Lightning",
      "summary": "Uses Lightning for low-fee, open, instant payments or machine-to-machine settlement."
    },
    {
      "id": "proof-of-work",
      "label": "Proof of Work",
      "summary": "Uses proof-of-work primitives or incentives as part of verification or market design."
    },
    {
      "id": "decentralized-coordination",
      "label": "Decentralized Coordination",
      "summary": "Shifts control from a single operator toward open, multi-party coordination."
    },
    {
      "id": "peer-to-peer-marketplace",
      "label": "Peer-to-Peer Marketplace",
      "summary": "Lets participants buy, sell, or match directly without a dominant centralized intermediary."
    },
    {
      "id": "federation",
      "label": "Federation",
      "summary": "Uses interoperable servers or communities rather than a single global silo."
    },
    {
      "id": "decentralized-manufacturing",
      "label": "Decentralized Manufacturing",
      "summary": "Pushes production toward distributed local operators instead of centralized factories."
    },
    {
      "id": "3d-printing",
      "label": "3D Printing",
      "summary": "Relies on additive manufacturing to lower capital barriers for hardware replication."
    },
    {
      "id": "open-hardware",
      "label": "Open Hardware",
      "summary": "Uses openly shared hardware designs, BOMs, or fabrication knowledge."
    },
    {
      "id": "cooperative-production",
      "label": "Cooperative Production",
      "summary": "Aligns producers or operators through shared ownership and cooperative governance."
    },
    {
      "id": "distributed-energy-generation",
      "label": "Distributed Energy Generation",
      "summary": "Moves generation capacity toward households, neighborhoods, or smaller local operators instead of large centralized plants."
    },
    {
      "id": "solar-manufacturing",
      "label": "Solar Manufacturing",
      "summary": "Uses open or distributed solar hardware design, assembly, or printable photovoltaic manufacturing to lower energy hardware barriers."
    },
    {
      "id": "wind-manufacturing",
      "label": "Wind Manufacturing",
      "summary": "Uses open or distributed wind hardware design, local fabrication, or service networks to decentralize small-scale wind deployment."
    },
    {
      "id": "home-microfactory",
      "label": "Home Microfactory",
      "summary": "Relies on compact local fabrication cells so households or small workshops can assemble, repair, or customize hardware."
    },
    {
      "id": "local-materials-processing",
      "label": "Local Materials Processing",
      "summary": "Pushes material preparation, part finishing, or component recovery closer to end users instead of distant industrial centers."
    },
    {
      "id": "open-energy-hardware",
      "label": "Open Energy Hardware",
      "summary": "Uses openly shared power, storage, metering, or control hardware as part of the competitive mechanism."
    },
    {
      "id": "microgrid-coordination",
      "label": "Microgrid Coordination",
      "summary": "Coordinates generation, storage, loads, or dispatch across many smaller grid participants instead of a single utility operator."
    },
    {
      "id": "recycling-and-reuse",
      "label": "Recycling And Reuse",
      "summary": "Competes by recovering, refurbishing, or reusing components and materials in open local loops."
    }
  ]
}
```

Return pure JSON only. Do not wrap it in markdown fences.

Return a JSON object matching this schema exactly:
{
  "schemaVersion": 1,
  "bundle": {
    "schemaVersion": 1,
    "company": {
      "slug": "company slug",
      "name": "company name",
      "ticker": "ticker",
      "rankApprox": 0,
      "maybeIpo": {
        "date": "YYYY-MM-DD",
        "dateSourceIds": ["source-id"],
        "marketCap": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "medium",
          "lastReviewedOn": "YYYY-MM-DD"
        }
      },
      "regionId": "taxonomy id",
      "indexIds": ["taxonomy id"],
      "sectorId": "taxonomy id",
      "industryId": "taxonomy id",
      "companiesMarketCapUrl": "https://example.com",
      "description": "one-sentence company description",
      "overview": [
        {
          "title": "section title",
          "paragraphs": ["paragraph one", "paragraph two"]
        }
      ],
      "moatNarrative": ["paragraph one", "paragraph two"],
      "decentralizationNarrative": ["paragraph one", "paragraph two"],
      "sourceIds": ["source-id"],
      "technologyWaveIds": ["taxonomy id"],
      "snapshotNote": "snapshot note",
      "inputMetrics": {
        "moat": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "decentralizability": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "profitability": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "peRatio": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "speculative",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "marketCap": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "medium",
          "lastReviewedOn": "YYYY-MM-DD"
        }
      }
    },
    "products": [
      {
        "slug": "product slug",
        "name": "product name",
        "category": "category",
        "homepageUrl": "https://example.com",
        "summary": "summary",
        "whyItMatters": "why it matters",
        "replacementSketch": ["paragraph one", "paragraph two"],
        "maybeDisruptionException": {
          "reason": "documented reason why even one credible concept is not justified yet",
          "sourceIds": ["source-id"],
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "sourceIds": ["source-id"],
        "technologyWaveIds": ["taxonomy id"],
        "alternatives": [
          {
            "slug": "alternative slug",
            "name": "alternative name",
            "kind": "open-source",
            "homepageUrl": "https://example.com",
            "repoUrl": "https://example.com/repo",
            "summary": "summary",
            "metrics": {
              "openness": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "decentralizationFit": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "readiness": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "costLeverage": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              }
            },
            "sourceIds": ["source-id"]
          }
        ],
        "disruptionConcepts": [
          {
            "slug": "concept slug",
            "name": "concept name",
            "summary": "one-paragraph summary",
            "angleIds": ["taxonomy id"],
            "thesis": "what this concept changes about the market structure",
            "bitcoinOrDecentralizationRole": "how bitcoin, lightning, proof-of-work, federation, or decentralized manufacturing actually matters here",
            "coordinationMechanism": "how buyers, sellers, operators, verifiers, or manufacturers coordinate",
            "verificationOrTrustModel": "how the system resists cheating, collusion, or false reporting",
            "failureModes": ["risk one", "risk two"],
            "adoptionPath": ["step one", "step two"],
            "confidence": "medium",
            "problemSourceIds": ["source-id"],
            "enablerSourceIds": ["source-id"],
            "metrics": {
              "decentralizationFit": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "coordinationCredibility": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "medium",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "implementationFeasibility": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "medium",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "incumbentPressure": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "medium",
                "lastReviewedOn": "YYYY-MM-DD"
              }
            }
          }
        ]
      }
    ]
  },
  "sources": [
    {
      "id": "source-id",
      "title": "source title",
      "url": "https://example.com",
      "kind": "investor-relations",
      "publisher": "publisher name",
      "note": "why this source matters",
      "accessedOn": "YYYY-MM-DD"
    }
  ],
  "summaryMarkdown": "optional short markdown summary"
}

Rules:
- Use only taxonomy IDs from the provided taxonomy JSON.
- Use source IDs consistently across the bundle and the sources array.
- `company.maybeIpo` must be either `null` or an object with `date`, `dateSourceIds`, and `marketCap`. Never return a bare string date such as `"1980-12-12"`.
- If you cannot support both the IPO date and the IPO market cap with sources, set `company.maybeIpo` to `null`.
- Source `kind` must be one of `investor-relations`, `annual-report`, `product-page`, `market-data`, `regulatory-filing`, `open-source-project`, `technical-docs`, or `analysis`.
- Do not invent source kind aliases such as `sec-filing` or `company-website`.
- Do not include derived company metrics such as freedCapitalPotential or IPO CAGR.
- Do not include product `companySlug`, product `alternativeSlugs`, or alternative `productSlug`; those are derived by the compiler.
- Alternative `kind` must be one of `open-source`, `decentralized`, `cooperative`, `protocol`, or `hybrid`.
- Alternatives should be plausible free, open, decentralized, cooperative, protocol, or hybrid replacements. Do not pad with generic proprietary incumbents or direct commercial peers that are not meaningfully aligned with that taxonomy.
- It is better to return fewer strong alternatives than to include invalid `commercial` competitors.
- Preserve strong existing alternatives unless you have a clear reason to improve or remove them.
- Every product must include `1` or `2` disruption concepts unless a documented `maybeDisruptionException` is genuinely justified.
- When the current bundle already has one strong disruption concept, preserve it by default and add a second concept only if the second mechanism is materially different from the first.
- Use `maybeDisruptionException` only for rare, defensible cases where even one credible concept would currently be dishonest.
- `maybeDisruptionException` and `disruptionConcepts` are mutually exclusive for a product.
- Every disruption concept must use at least one `angleId`, at least one `problemSourceId`, at least one `enablerSourceId`, and all four concept metrics.
- Prefer Bitcoin, Lightning, or proof-of-work angles when they are genuinely central to the mechanism. When they are not central, justify federated, peer-to-peer, cooperative, open-hardware, or decentralized-manufacturing angles explicitly instead of forcing Bitcoin in unnaturally.
- For physical-world products, prefer materially different second concepts such as distributed energy generation, solar or wind manufacturing, home microfactories, local materials processing, recycling loops, or open energy hardware when the sources support them.
- Ambitious concepts such as printable solar, printable wind components, or household fabrication cells are allowed when the confidence is honestly marked `speculative`, the enabling primitives are documented, and the failure modes state what still has to go right.
- When the concept depends on verification, incentives, or marketplaces, explain how cheating, collusion, spoofing, or fake fulfillment would be constrained in `verificationOrTrustModel` and note major weaknesses in `failureModes`.
- Keep `replacementSketch` narrative and lightweight. Put the structured original concept analysis in `disruptionConcepts`, not in `replacementSketch`.
- Omit optional fields such as `repoUrl` when they do not apply. Do not emit `null` for optional strings.
- Prefer preserving strong current fields when the existing bundle already has solid information and only update what is materially improved.
- Return valid JSON and nothing else.
