You are preparing a publishable JSON refresh for the Free The World registry.

Company slug: oneok

Manifest:
```json
{
  "schemaVersion": 1,
  "slug": "oneok",
  "name": "ONEOK",
  "ticker": "OKE",
  "regionId": "us",
  "indexIds": [
    "sp500-top200"
  ],
  "sectorId": "energy",
  "industryId": "oil-gas-midstream",
  "companiesMarketCapUrl": "https://companiesmarketcap.com/oneok/marketcap/",
  "description": "ONEOK provides midstream energy services for natural gas, natural gas liquids, refined products, and crude oil.",
  "technologyWaveIds": [
    "distributed-energy"
  ],
  "maybeIpo": null,
  "seedProductNames": [
    "Natural gas liquids transportation",
    "Natural gas gathering and processing"
  ],
  "seedSourceUrls": [
    "https://www.oneok.com/",
    "https://www.globenewswire.com/de/news-release/2026/02/23/3243069/0/en/oneok-announces-higher-full-year-2025-earnings-net-income-up-11-adjusted-ebitda-up-18.html",
    "https://www.sec.gov/Archives/edgar/data/1039684/000103968426000012/ars2025.pdf",
    "https://companiesmarketcap.com/oneok/marketcap/",
    "https://stockanalysis.com/stocks/oke/statistics/"
  ],
  "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
}
```

Current bundle (may be null for new companies):
```json
{
  "schemaVersion": 1,
  "company": {
    "slug": "oneok",
    "name": "ONEOK",
    "ticker": "OKE",
    "rankApprox": 176,
    "maybeIpo": null,
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "energy",
    "industryId": "oil-gas-midstream",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/oneok/marketcap/",
    "description": "ONEOK provides midstream energy services for natural gas, natural gas liquids, refined products, and crude oil.",
    "overview": [
      {
        "title": "Business footprint",
        "paragraphs": [
          "ONEOK is a U.S. midstream energy company with operating segments in natural gas liquids, refined products and crude oil, natural gas gathering and processing, and natural gas pipelines.",
          "Its core role is not consumer-facing fuel retail but infrastructure coordination: gathering, processing, fractionating, transporting, storing, and distributing hydrocarbons between producers, processors, refiners, utilities, and end markets."
        ]
      },
      {
        "title": "Strategic position",
        "paragraphs": [
          "The company benefits from regulated and difficult-to-replicate pipeline corridors, processing assets, storage, fractionation capacity, producer relationships, and scale in hydrocarbon logistics.",
          "Its exposure to the energy transition is indirect but material: lower long-run hydrocarbon demand, stricter methane accountability, and more distributed energy systems can reduce the strategic importance of centralized fossil-fuel midstream networks over time."
        ]
      }
    ],
    "moatNarrative": [
      "ONEOK's moat is high because midstream assets require rights-of-way, interconnections, permits, long-lived capital, operating expertise, and commercial relationships that are hard to reproduce quickly. Pipeline and fractionation infrastructure creates network effects around basin access and destination markets.",
      "The moat is not absolute. Volumes depend on producer activity and end-market hydrocarbon demand, while acquisitions, regulatory scrutiny, environmental obligations, and commodity-linked activity cycles can shift returns."
    ],
    "decentralizationNarrative": [
      "ONEOK's core infrastructure is intrinsically centralized: large pipeline, processing, storage, and fractionation networks coordinate bulk commodity flows at industrial scale. Direct free or open-source replacement of these physical assets is not credible in the near term.",
      "Decentralization pressure is more plausible at the margin: open methane monitoring, community and regulator visibility into emissions, distributed energy generation, demand-side flexibility, and local electrification can reduce dependence on fossil-fuel throughput and weaken the informational advantage of incumbent operators."
    ],
    "sourceIds": [
      "oneok-home-2026",
      "oneok-2025-results-2026",
      "oneok-2025-annual-report-sec",
      "companiesmarketcap-oneok-2026",
      "stockanalysis-oke-statistics-2026"
    ],
    "technologyWaveIds": [
      "distributed-energy"
    ],
    "snapshotNote": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200.",
    "inputMetrics": {
      "moat": {
        "value": 86,
        "rationale": "Large-scale midstream energy assets have durable barriers from rights-of-way, permitting, interconnections, storage, fractionation, processing capacity, and customer relationships.",
        "sourceIds": [
          "oneok-home-2026",
          "oneok-2025-annual-report-sec"
        ],
        "confidence": "high",
        "lastReviewedOn": "2026-06-01"
      },
      "decentralizability": {
        "value": 18,
        "rationale": "The company's main products are centralized physical infrastructure services, though open monitoring, distributed energy, and demand-side tools can decentralize adjacent coordination and accountability layers.",
        "sourceIds": [
          "oneok-home-2026",
          "carbon-mapper-nasa-2026",
          "opendsm-lfenergy-2026"
        ],
        "confidence": "medium",
        "lastReviewedOn": "2026-06-01"
      },
      "profitability": {
        "value": 82,
        "rationale": "ONEOK reported full-year 2025 net income attributable to ONEOK of approximately $3.39 billion, up year over year, indicating strong profitability for a capital-intensive midstream operator.",
        "sourceIds": [
          "oneok-2025-results-2026"
        ],
        "confidence": "high",
        "lastReviewedOn": "2026-06-01"
      },
      "peRatio": {
        "value": 16.54,
        "rationale": "StockAnalysis reported ONEOK's trailing P/E ratio at 16.54 in its current statistics page.",
        "sourceIds": [
          "stockanalysis-oke-statistics-2026"
        ],
        "confidence": "medium",
        "lastReviewedOn": "2026-06-01"
      },
      "marketCap": {
        "value": 56980000000,
        "rationale": "CompaniesMarketCap reported ONEOK's market capitalization at approximately $56.98 billion in May 2026.",
        "sourceIds": [
          "companiesmarketcap-oneok-2026"
        ],
        "confidence": "medium",
        "lastReviewedOn": "2026-06-01"
      }
    }
  },
  "products": [
    {
      "slug": "natural-gas-liquids-transportation",
      "name": "Natural gas liquids transportation",
      "category": "Midstream energy infrastructure",
      "homepageUrl": "https://www.oneok.com/",
      "summary": "ONEOK gathers, fractionates, treats, distributes, stores, and transports natural gas liquids through large-scale midstream infrastructure.",
      "whyItMatters": "NGL logistics connect upstream production to petrochemical, heating, export, and fuel markets, making the system commercially important but capital-intensive and difficult to decentralize directly.",
      "replacementSketch": [
        "The realistic replacement path is not a small open-source pipeline operator. It is a gradual reduction in dependence on NGL throughput through electrification, distributed energy, demand-side flexibility, open emissions data, and local energy coordination.",
        "Open tools can also pressure incumbent midstream operators by making facility emissions, flaring, and operating claims easier for regulators, customers, insurers, and communities to verify."
      ],
      "sourceIds": [
        "oneok-home-2026",
        "oneok-2025-annual-report-sec"
      ],
      "technologyWaveIds": [
        "distributed-energy"
      ],
      "alternatives": [
        {
          "slug": "flaring-monitor",
          "name": "Flaring Monitor",
          "kind": "open-source",
          "homepageUrl": "https://www.flaringmonitor.org/",
          "summary": "Open-source monitoring project that uses public satellite data and disclosed ownership information to estimate company-level gas flaring emissions.",
          "metrics": {
            "openness": {
              "value": 88,
              "rationale": "The project describes itself as open source and based on publicly available satellite data, algorithms, and datasets.",
              "sourceIds": [
                "flaring-monitor-2026"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "decentralizationFit": {
              "value": 64,
              "rationale": "It decentralizes oversight and emissions intelligence rather than replacing physical NGL transportation assets.",
              "sourceIds": [
                "flaring-monitor-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "readiness": {
              "value": 62,
              "rationale": "It is a live monitoring concept, but its role is transparency and accountability rather than operational substitution.",
              "sourceIds": [
                "flaring-monitor-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "costLeverage": {
              "value": 70,
              "rationale": "Public satellite data and open algorithms can reduce the cost of third-party flaring scrutiny compared with proprietary audits alone.",
              "sourceIds": [
                "flaring-monitor-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            }
          },
          "sourceIds": [
            "flaring-monitor-2026"
          ]
        }
      ],
      "disruptionConcepts": [
        {
          "slug": "open-methane-and-flaring-accountability-layer",
          "name": "Open methane and flaring accountability layer",
          "summary": "A public monitoring layer combines satellite methane detection, flaring estimates, facility registries, and community reporting so buyers, regulators, insurers, and local stakeholders can compare midstream assets on verified environmental performance rather than self-reported disclosure alone.",
          "angleIds": [
            "decentralized-coordination",
            "open-energy-hardware"
          ],
          "thesis": "If hydrocarbon logistics remain necessary, the market structure can still shift away from opaque bilateral trust toward independently measured facility performance, raising the cost of leaks, flaring, and unverifiable operating claims.",
          "bitcoinOrDecentralizationRole": "Decentralization matters as a data governance and verification mechanism: multiple observers, public datasets, open algorithms, and auditable attestations reduce dependence on a single operator's disclosure.",
          "coordinationMechanism": "Satellite providers, open-source analysts, regulators, landowners, customers, and insurers coordinate around facility identifiers, event timestamps, emission estimates, and remediation evidence.",
          "verificationOrTrustModel": "Cheating is constrained by cross-checking operator reports against independent satellite detections, time-stamped observations, public plume or flare estimates, and repeat observations. The model is weakest for intermittent emissions below detection thresholds.",
          "failureModes": [
            "Satellite revisit frequency, weather, plume detection limits, and attribution uncertainty can miss or misclassify events.",
            "Operators and counterparties may treat transparency as a compliance cost rather than a purchasing criterion unless regulators, insurers, or customers enforce consequences."
          ],
          "adoptionPath": [
            "Start with public dashboards for high-emission basins and assets using satellite and flaring datasets.",
            "Add buyer, insurer, and regulator workflows that tie verified remediation evidence to contracts, permits, or risk pricing."
          ],
          "confidence": "medium",
          "problemSourceIds": [
            "oneok-2025-annual-report-sec"
          ],
          "enablerSourceIds": [
            "carbon-mapper-nasa-2026",
            "imeo-eye-on-methane-2026",
            "flaring-monitor-2026"
          ],
          "metrics": {
            "decentralizationFit": {
              "value": 70,
              "rationale": "The concept decentralizes oversight and market information, though it does not decentralize physical pipeline ownership.",
              "sourceIds": [
                "carbon-mapper-nasa-2026",
                "imeo-eye-on-methane-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "coordinationCredibility": {
              "value": 68,
              "rationale": "Public methane and flaring datasets already support multi-party accountability, but commercial adoption depends on buyers and regulators acting on the data.",
              "sourceIds": [
                "imeo-eye-on-methane-2026",
                "flaring-monitor-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "implementationFeasibility": {
              "value": 72,
              "rationale": "The enabling data and tools exist, but facility attribution, operational integration, and enforcement workflows remain hard.",
              "sourceIds": [
                "carbon-mapper-nasa-2026",
                "flaring-monitor-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "incumbentPressure": {
              "value": 55,
              "rationale": "Transparency can pressure margins and behavior, but it is unlikely to replace NGL transportation demand by itself.",
              "sourceIds": [
                "oneok-2025-annual-report-sec",
                "carbon-mapper-nasa-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            }
          }
        },
        {
          "slug": "distributed-electrification-demand-reduction",
          "name": "Distributed electrification and demand reduction",
          "summary": "Open demand-side measurement, distributed generation, and local energy management reduce the need for some fossil-fuel-derived heat, power, and industrial energy demand, gradually lowering the growth ceiling for NGL logistics.",
          "angleIds": [
            "distributed-energy-generation",
            "microgrid-coordination",
            "open-energy-hardware"
          ],
          "thesis": "Midstream transportation moats weaken if end users and communities can satisfy more energy needs through local generation, electrification, storage, and measured demand flexibility rather than expanding hydrocarbon throughput.",
          "bitcoinOrDecentralizationRole": "The decentralization role is local energy coordination, not Bitcoin. Open metering, transparent demand response, and interoperable control systems let many smaller actors coordinate energy reductions without a single utility or fuel supplier controlling the stack.",
          "coordinationMechanism": "Households, commercial buildings, aggregators, utilities, and community energy projects coordinate through open metering, normalized measurement, distributed energy resources, and local dispatch rules.",
          "verificationOrTrustModel": "Energy reductions are verified through metered baselines, open measurement methods, device telemetry, and settlement rules. The main trust risk is inflated baselines or non-additional reductions.",
          "failureModes": [
            "Industrial and petrochemical NGL demand may remain difficult to electrify or substitute.",
            "Demand-side measurement can be gamed if baselines, weather normalization, and device telemetry are not independently auditable."
          ],
          "adoptionPath": [
            "Deploy open measurement tools for efficiency, load shifting, and distributed energy programs in buildings and communities.",
            "Scale procurement and policy incentives that reward verified reductions in fossil-fuel demand rather than only new centralized supply."
          ],
          "confidence": "speculative",
          "problemSourceIds": [
            "oneok-home-2026",
            "oneok-2025-annual-report-sec"
          ],
          "enablerSourceIds": [
            "opendsm-lfenergy-2026",
            "openenergymonitor-hardware-2026"
          ],
          "metrics": {
            "decentralizationFit": {
              "value": 76,
              "rationale": "The mechanism shifts energy decisions toward households, communities, and distributed resource operators.",
              "sourceIds": [
                "opendsm-lfenergy-2026",
                "openenergymonitor-hardware-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "coordinationCredibility": {
              "value": 58,
              "rationale": "Open measurement and monitoring tools support coordination, but scaling them into markets that materially reduce NGL demand is still uncertain.",
              "sourceIds": [
                "opendsm-lfenergy-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "implementationFeasibility": {
              "value": 50,
              "rationale": "Building-level monitoring and demand-side measurement are feasible, but replacing industrial hydrocarbon use is much harder.",
              "sourceIds": [
                "opendsm-lfenergy-2026",
                "openenergymonitor-hardware-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "incumbentPressure": {
              "value": 45,
              "rationale": "The pressure is long-term and demand-side; it may cap growth more than immediately displace existing midstream assets.",
              "sourceIds": [
                "oneok-2025-annual-report-sec",
                "opendsm-lfenergy-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            }
          }
        }
      ]
    },
    {
      "slug": "natural-gas-gathering-and-processing",
      "name": "Natural gas gathering and processing",
      "category": "Midstream energy infrastructure",
      "homepageUrl": "https://www.oneok.com/",
      "summary": "ONEOK provides gathering and processing services that connect natural gas producers in multiple U.S. basins to downstream markets and related NGL value chains.",
      "whyItMatters": "Gathering and processing networks are a core coordination layer for upstream natural gas production, determining how raw gas is moved, treated, and monetized.",
      "replacementSketch": [
        "A direct open replacement for gathering and processing infrastructure is not credible because the work requires physical networks, gas plants, compression, safety systems, permits, and producer contracts.",
        "The plausible open disruption path is around monitoring, verification, smaller-scale energy substitution, and open industrial controls that make operations more transparent and less dependent on proprietary information asymmetry."
      ],
      "sourceIds": [
        "oneok-home-2026",
        "oneok-2025-results-2026",
        "oneok-2025-annual-report-sec"
      ],
      "technologyWaveIds": [
        "distributed-energy"
      ],
      "alternatives": [
        {
          "slug": "natural-gas-gathering-and-processing-openenergymonitor",
          "name": "OpenEnergyMonitor",
          "kind": "open-source",
          "homepageUrl": "https://openenergymonitor.org/",
          "repoUrl": "https://github.com/openenergymonitor",
          "summary": "Open-source hardware and software for energy monitoring that can support local measurement, energy awareness, and distributed energy management.",
          "metrics": {
            "openness": {
              "value": 90,
              "rationale": "OpenEnergyMonitor publishes open-source hardware and software repositories for energy monitoring.",
              "sourceIds": [
                "openenergymonitor-github-2026",
                "openenergymonitor-hardware-2026"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "decentralizationFit": {
              "value": 66,
              "rationale": "It supports local measurement and self-hosted energy visibility, though it does not replace gas processing infrastructure directly.",
              "sourceIds": [
                "openenergymonitor-github-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "readiness": {
              "value": 70,
              "rationale": "The project has mature public hardware and software resources for energy monitoring use cases.",
              "sourceIds": [
                "openenergymonitor-hardware-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "costLeverage": {
              "value": 63,
              "rationale": "Open hardware and software can lower the cost of local monitoring and demand-side experimentation.",
              "sourceIds": [
                "openenergymonitor-hardware-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            }
          },
          "sourceIds": [
            "openenergymonitor-github-2026",
            "openenergymonitor-hardware-2026"
          ]
        }
      ],
      "disruptionConcepts": [
        {
          "slug": "federated-basin-methane-verification",
          "name": "Federated basin methane verification",
          "summary": "A federated verification network combines satellite observations, open models, operator-submitted repair evidence, and community or regulator reports to score gas gathering and processing systems by measured methane performance.",
          "angleIds": [
            "federation",
            "decentralized-coordination"
          ],
          "thesis": "Gathering and processing operators keep their physical assets, but their market power from opaque operational claims weakens when methane intensity and remediation performance can be independently compared across basins.",
          "bitcoinOrDecentralizationRole": "Federation matters because no single observer has complete ground truth. Independent satellite, regulator, operator, and community nodes can publish signed observations into a shared evidence graph.",
          "coordinationMechanism": "Participants coordinate around facility IDs, geospatial boundaries, plume detections, repair tickets, inspection windows, and public scorecards.",
          "verificationOrTrustModel": "False claims are constrained through independent observations, repeat detections, signed submissions, and conflict flags when operator reports contradict public or third-party data. The model remains vulnerable to sparse observations and attribution disputes.",
          "failureModes": [
            "Intermittent methane events may evade observation or be hard to attribute to a specific operator.",
            "Federated reporting can fragment if participants cannot agree on facility identifiers, confidence thresholds, or remediation standards."
          ],
          "adoptionPath": [
            "Publish basin-level methane event registries that merge public satellite observations with facility and infrastructure maps.",
            "Add procurement, insurance, and regulatory workflows that reward verified reductions and penalize unresolved repeat events."
          ],
          "confidence": "medium",
          "problemSourceIds": [
            "oneok-2025-annual-report-sec"
          ],
          "enablerSourceIds": [
            "carbon-inversion-imi-2026",
            "imeo-eye-on-methane-2026",
            "carbon-mapper-nasa-2026"
          ],
          "metrics": {
            "decentralizationFit": {
              "value": 72,
              "rationale": "The concept distributes verification among multiple observers and data publishers rather than relying only on operator disclosure.",
              "sourceIds": [
                "carbon-inversion-imi-2026",
                "imeo-eye-on-methane-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "coordinationCredibility": {
              "value": 64,
              "rationale": "Open-access methane tools and public data platforms exist, but shared commercial enforcement is still emerging.",
              "sourceIds": [
                "carbon-inversion-imi-2026",
                "imeo-eye-on-methane-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "implementationFeasibility": {
              "value": 67,
              "rationale": "The data stack is plausible today, while high-confidence attribution and remediation validation remain operationally complex.",
              "sourceIds": [
                "carbon-inversion-imi-2026",
                "carbon-mapper-nasa-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "incumbentPressure": {
              "value": 52,
              "rationale": "It pressures poor-performing assets and disclosure practices, but does not remove the need for gathering and processing where gas production continues.",
              "sourceIds": [
                "oneok-2025-annual-report-sec",
                "imeo-eye-on-methane-2026"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            }
          }
        }
      ]
    }
  ]
}
```

Current referenced sources:
```json
[
  {
    "id": "carbon-inversion-imi-2026",
    "title": "Integrated Methane Inversion",
    "url": "https://carboninversion.com/",
    "kind": "technical-docs",
    "publisher": "Integrated Methane Inversion",
    "note": "Open-access methane emissions inference tool using TROPOMI observations and NASA GEOS data.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "carbon-mapper-nasa-2026",
    "title": "NASA Carbon Monitoring System: Carbon Mapper",
    "url": "https://carbon.nasa.gov/carbon_mapper.html",
    "kind": "technical-docs",
    "publisher": "NASA Carbon Monitoring System",
    "note": "Documents facility-scale methane and carbon dioxide monitoring as an enabling technology for independent emissions accountability.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "companiesmarketcap-oneok-2026",
    "title": "ONEOK Market Capitalization",
    "url": "https://companiesmarketcap.com/oneok/marketcap/",
    "kind": "market-data",
    "publisher": "CompaniesMarketCap",
    "note": "Market capitalization source used for the snapshot market cap metric.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "flaring-monitor-2026",
    "title": "Flaring Monitor",
    "url": "https://www.flaringmonitor.org/",
    "kind": "open-source-project",
    "publisher": "Flaring Monitor",
    "note": "Open-source project using public satellite data to estimate real-time company-level gas flaring emissions.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "imeo-eye-on-methane-2026",
    "title": "Eye on Methane data platform",
    "url": "https://methanedata.unep.org/",
    "kind": "technical-docs",
    "publisher": "UNEP International Methane Emissions Observatory",
    "note": "Open methane data platform relevant to multi-party monitoring and verification of oil and gas emissions.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "oneok-2025-annual-report-sec",
    "title": "ONEOK 2025 Annual Report",
    "url": "https://www.sec.gov/Archives/edgar/data/1039684/000103968426000012/ars2025.pdf",
    "kind": "annual-report",
    "publisher": "U.S. Securities and Exchange Commission",
    "note": "Primary annual filing source for business description, risk context, segments, and reported financials.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "oneok-2025-results-2026",
    "title": "ONEOK Announces Higher Full-Year 2025 Earnings: Net Income up 11%, Adjusted EBITDA up 18%",
    "url": "https://www.globenewswire.com/de/news-release/2026/02/23/3243069/0/en/oneok-announces-higher-full-year-2025-earnings-net-income-up-11-adjusted-ebitda-up-18.html",
    "kind": "investor-relations",
    "publisher": "ONEOK",
    "note": "Provides reported 2025 net income and adjusted EBITDA context for profitability scoring.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "oneok-home-2026",
    "title": "ONEOK corporate website",
    "url": "https://www.oneok.com/",
    "kind": "product-page",
    "publisher": "ONEOK",
    "note": "Describes ONEOK's operating segments, including natural gas liquids, refined products and crude, natural gas gathering and processing, and natural gas pipelines.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "opendsm-lfenergy-2026",
    "title": "OpenDSM",
    "url": "https://lfenergy.org/projects/opendsm/",
    "kind": "open-source-project",
    "publisher": "LF Energy",
    "note": "Open-source demand-side measurement project relevant to verified energy efficiency and load-shifting programs.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openenergymonitor-github-2026",
    "title": "OpenEnergyMonitor GitHub organization",
    "url": "https://github.com/openenergymonitor",
    "kind": "open-source-project",
    "publisher": "OpenEnergyMonitor",
    "note": "Repository organization for open-source energy monitoring tools.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openenergymonitor-hardware-2026",
    "title": "OpenEnergyMonitor Hardware",
    "url": "https://github.com/openenergymonitor/Hardware",
    "kind": "open-source-project",
    "publisher": "OpenEnergyMonitor",
    "note": "Open-source hardware repository for energy monitoring devices.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "stockanalysis-oke-statistics-2026",
    "title": "ONEOK Statistics and Valuation",
    "url": "https://stockanalysis.com/stocks/oke/statistics/",
    "kind": "market-data",
    "publisher": "StockAnalysis",
    "note": "Market statistics source for current P/E ratio and valuation context.",
    "accessedOn": "2026-06-01"
  }
]
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
