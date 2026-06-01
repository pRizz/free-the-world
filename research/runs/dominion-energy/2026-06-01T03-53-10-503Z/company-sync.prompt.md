You are preparing a publishable JSON refresh for the Free The World registry.

Company slug: dominion-energy

Manifest:
```json
{
  "schemaVersion": 1,
  "slug": "dominion-energy",
  "name": "Dominion Energy",
  "ticker": "D",
  "regionId": "us",
  "indexIds": [
    "sp500-top200"
  ],
  "sectorId": "utilities",
  "industryId": "electric-utilities",
  "companiesMarketCapUrl": "https://companiesmarketcap.com/dominion-energy/marketcap/",
  "description": "Dominion Energy is a regulated U.S. utility holding company providing electricity service in Virginia, North Carolina, and South Carolina and natural gas service in South Carolina.",
  "technologyWaveIds": [
    "distributed-energy"
  ],
  "maybeIpo": null,
  "seedProductNames": [
    "Electric utility service",
    "Natural gas service"
  ],
  "seedSourceUrls": [
    "https://investors.dominionenergy.com/HOME/",
    "https://investors.dominionenergy.com/news/press-release-details/2026/Dominion-Energy-announces-2025-financial-results/default.aspx",
    "https://companiesmarketcap.com/dominion-energy/marketcap/",
    "https://investors.dominionenergy.com/news/press-release-details/2026/NextEra-Energy-and-Dominion-Energy-to-Combine-Creating-the-Worlds-Largest-Regulated-Electric-Utility-Business-and-North-Americas-Premier-Energy-Infrastructure-Platform-Benefiting-Customers/default.aspx"
  ],
  "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
}
```

Current bundle (may be null for new companies):
```json
{
  "schemaVersion": 1,
  "company": {
    "slug": "dominion-energy",
    "name": "Dominion Energy",
    "ticker": "D",
    "rankApprox": 188,
    "maybeIpo": null,
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "utilities",
    "industryId": "electric-utilities",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/dominion-energy/marketcap/",
    "description": "Dominion Energy is a regulated U.S. utility holding company providing electricity service in Virginia, North Carolina, and South Carolina and natural gas service in South Carolina.",
    "overview": [
      {
        "title": "Regulated utility footprint",
        "paragraphs": [
          "Dominion Energy is centered on regulated electric and gas utility operations, with investor materials describing electricity service to about 3.6 million homes and businesses and regulated natural gas service to about 500,000 customers in South Carolina.",
          "Its core business depends on state-regulated infrastructure, generation planning, cost recovery, transmission and distribution reliability, and long-lived capital investment rather than fast-moving consumer product cycles."
        ]
      },
      {
        "title": "Current strategic context",
        "paragraphs": [
          "The company reported 2025 net income attributable to Dominion Energy of about $3.0 billion and continues to frame its business around reliable, affordable, and increasingly clean energy.",
          "A May 2026 announced combination with NextEra Energy, if completed and approved, would change Dominion's ownership and scale context, but this registry snapshot still treats Dominion as the current public-company subject."
        ]
      }
    ],
    "moatNarrative": [
      "Dominion's moat is mainly institutional and physical: regulated monopoly service territories, transmission and distribution assets, generation assets, rate-base economics, permitting, grid reliability obligations, and customer dependence on essential service.",
      "That moat is strong in the near and medium term because households and businesses cannot easily bypass the distribution grid. The weakness is that distributed generation, demand response, storage, open energy management, and thermal electrification can shift more operational control toward customers and aggregators over time."
    ],
    "decentralizationNarrative": [
      "Electric and gas utility service is difficult to decentralize because public safety, reliability, rights-of-way, interconnection, metering, and regulated cost recovery remain centralized functions.",
      "The credible decentralization path is not a direct one-for-one replacement of the utility. It is a layered erosion: customer-owned solar, storage, controllable loads, open demand-response protocols, community microgrids, open grid mapping, and electrified thermal networks can reduce how much centralized fuel delivery and dispatch discretion the incumbent controls."
    ],
    "sourceIds": [
      "dominion-ir-profile-2026",
      "dominion-2025-results",
      "dominion-marketcap-2026",
      "nextera-dominion-merger-2026"
    ],
    "technologyWaveIds": [
      "distributed-energy"
    ],
    "snapshotNote": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200; refreshed with public sources reviewed on 2026-06-01.",
    "inputMetrics": {
      "moat": {
        "value": 86,
        "rationale": "Regulated service territories, essential infrastructure, generation and grid assets, and rate-base economics create a very strong utility moat.",
        "sourceIds": [
          "dominion-ir-profile-2026",
          "dominion-2025-10k"
        ],
        "confidence": "high",
        "lastReviewedOn": "2026-06-01"
      },
      "decentralizability": {
        "value": 38,
        "rationale": "The physical grid and safety obligations are hard to decentralize, but distributed energy resources, open demand response, and customer-side energy management can decentralize meaningful layers of generation, flexibility, and control.",
        "sourceIds": [
          "openadr-home",
          "openems-home",
          "openenergymonitor-about"
        ],
        "confidence": "high",
        "lastReviewedOn": "2026-06-01"
      },
      "profitability": {
        "value": 71,
        "rationale": "Dominion reported about $3.0 billion of 2025 net income, reflecting profitable regulated utility operations despite capital-intensive infrastructure obligations.",
        "sourceIds": [
          "dominion-2025-results"
        ],
        "confidence": "high",
        "lastReviewedOn": "2026-06-01"
      },
      "peRatio": {
        "value": 19.9,
        "rationale": "Approximate market capitalization of $59.51 billion divided by 2025 net income attributable to Dominion Energy of about $2.998 billion implies a rough trailing P/E near 20; this is a simplified snapshot rather than a normalized utility valuation.",
        "sourceIds": [
          "dominion-marketcap-2026",
          "dominion-2025-results"
        ],
        "confidence": "speculative",
        "lastReviewedOn": "2026-06-01"
      },
      "marketCap": {
        "value": 59510000000,
        "rationale": "CompaniesMarketCap reported Dominion Energy's market capitalization at about $59.51 billion as of May 2026.",
        "sourceIds": [
          "dominion-marketcap-2026"
        ],
        "confidence": "medium",
        "lastReviewedOn": "2026-06-01"
      }
    }
  },
  "products": [
    {
      "slug": "electric-utility-service",
      "name": "Electric utility service",
      "category": "Regulated electricity service",
      "homepageUrl": "https://www.dominionenergy.com/",
      "summary": "Dominion provides regulated electric generation, transmission, distribution, and customer service across parts of Virginia, North Carolina, and South Carolina.",
      "whyItMatters": "Electric utility service is the core infrastructure layer that determines household power reliability, industrial growth capacity, grid interconnection terms, and the pace at which distributed energy can become useful at scale.",
      "replacementSketch": [
        "A practical replacement path would not remove the grid. It would make more generation, flexibility, monitoring, and local dispatch customer-owned or community-operated while the incumbent grid becomes a reliability backstop and settlement layer.",
        "Open protocols, open-source energy management, interoperable devices, and transparent grid data can let households, campuses, and neighborhoods coordinate energy use without every decision flowing through a single vertically controlled utility stack."
      ],
      "sourceIds": [
        "dominion-ir-profile-2026",
        "dominion-2025-10k",
        "openadr-home",
        "openems-home",
        "openinframap-about"
      ],
      "technologyWaveIds": [
        "distributed-energy"
      ],
      "alternatives": [
        {
          "slug": "electric-utility-service-openems",
          "name": "OpenEMS",
          "kind": "open-source",
          "homepageUrl": "https://openems.io/",
          "repoUrl": "https://github.com/OpenEMS/openems",
          "summary": "OpenEMS is an open-source energy management platform for coordinating renewable generation, storage, grid interaction, and controllable loads.",
          "metrics": {
            "openness": {
              "value": 88,
              "rationale": "The project is explicitly open source and publishes its code on GitHub.",
              "sourceIds": [
                "openems-home",
                "openems-github"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "decentralizationFit": {
              "value": 73,
              "rationale": "It helps shift optimization and control toward local energy systems, storage, charging, and distributed generation rather than only central dispatch.",
              "sourceIds": [
                "openems-home"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "readiness": {
              "value": 68,
              "rationale": "The project has active public code and a defined energy-management architecture, though deployment still requires hardware integration, installer capability, and utility interconnection rules.",
              "sourceIds": [
                "openems-github"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "costLeverage": {
              "value": 61,
              "rationale": "Open control software can reduce vendor lock-in and improve optimization, but most cost remains in physical generation, storage, electrical work, and interconnection.",
              "sourceIds": [
                "openems-home"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            }
          },
          "sourceIds": [
            "openems-home",
            "openems-github"
          ]
        },
        {
          "slug": "electric-utility-service-openadr",
          "name": "OpenADR",
          "kind": "protocol",
          "homepageUrl": "https://www.openadr.org/",
          "summary": "OpenADR is an open automated demand-response standard used to communicate grid events and flexibility signals between utilities, aggregators, and distributed energy resources.",
          "metrics": {
            "openness": {
              "value": 76,
              "rationale": "OpenADR is a published interoperability standard rather than a single proprietary utility control system.",
              "sourceIds": [
                "openadr-home"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "decentralizationFit": {
              "value": 70,
              "rationale": "It enables many distributed devices, aggregators, and customer-side systems to respond to grid needs through standardized signals.",
              "sourceIds": [
                "openadr-home"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "readiness": {
              "value": 74,
              "rationale": "The standard is specifically designed for automated demand response and distributed energy resources, though local market rules determine actual participation.",
              "sourceIds": [
                "openadr-home",
                "openadr-der-factsheet"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "costLeverage": {
              "value": 66,
              "rationale": "Demand response can defer some peak infrastructure and fuel costs, but savings depend on program design, device penetration, and customer compensation.",
              "sourceIds": [
                "openadr-home"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            }
          },
          "sourceIds": [
            "openadr-home",
            "openadr-der-factsheet"
          ]
        }
      ],
      "disruptionConcepts": [
        {
          "slug": "federated-der-flexibility-market",
          "name": "Federated DER flexibility market",
          "summary": "Homes, businesses, campuses, and community batteries expose verifiable flexibility through open demand-response signals and local energy-management systems, letting aggregators compete to reduce peaks, absorb renewables, and provide grid services without a single utility-owned control stack.",
          "angleIds": [
            "decentralized-coordination",
            "microgrid-coordination",
            "distributed-energy-generation"
          ],
          "thesis": "The market structure shifts from one regulated utility controlling most dispatch and customer programs toward many interoperable flexibility providers coordinated through open protocols.",
          "bitcoinOrDecentralizationRole": "Decentralization matters through interoperable control and multi-party aggregation, not through Bitcoin. Open protocols and customer-side controllers reduce dependence on one proprietary utility platform.",
          "coordinationMechanism": "Utilities or grid operators publish events and price signals; aggregators enroll devices; local controllers decide how much load, storage, or generation flexibility to offer; settlement rewards verified performance.",
          "verificationOrTrustModel": "Smart-meter interval data, device telemetry, baseline rules, and aggregator audits constrain fake curtailment. Independent measurement rules are still needed because baselines can be gamed and device owners may overstate available capacity.",
          "failureModes": [
            "Poor baseline design could reward customers for reductions that were not actually delivered.",
            "Fragmented interconnection and retail tariff rules could prevent customer-side assets from participating at useful scale.",
            "Cybersecurity failures in aggregators or device fleets could turn flexibility resources into operational risk."
          ],
          "adoptionPath": [
            "Start with commercial buildings, batteries, thermostats, and EV chargers participating in utility demand-response programs.",
            "Expand to residential and community aggregations using open energy-management software and standard event signaling.",
            "Let regulators require portability, transparent settlement, and non-discriminatory access for qualified distributed resources."
          ],
          "confidence": "medium",
          "problemSourceIds": [
            "dominion-2025-10k",
            "dominion-ir-profile-2026"
          ],
          "enablerSourceIds": [
            "openadr-home",
            "openems-home",
            "openenergymonitor-about"
          ],
          "metrics": {
            "decentralizationFit": {
              "value": 76,
              "rationale": "The concept directly coordinates many customer-owned resources rather than relying only on centralized generation and utility-owned control.",
              "sourceIds": [
                "openadr-home",
                "openems-home"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "coordinationCredibility": {
              "value": 67,
              "rationale": "OpenADR and active open energy-management projects show credible coordination primitives, but settlement and participation rules remain jurisdiction-specific.",
              "sourceIds": [
                "openadr-home",
                "openems-github"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "implementationFeasibility": {
              "value": 62,
              "rationale": "The software and protocol pieces exist, but scaled implementation requires metering access, customer enrollment, device integration, cybersecurity, and regulatory approval.",
              "sourceIds": [
                "openadr-der-factsheet",
                "openems-home"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "incumbentPressure": {
              "value": 55,
              "rationale": "This would pressure utility peak-planning and customer-program control, but regulated utilities would still own essential wires and reliability obligations.",
              "sourceIds": [
                "dominion-2025-10k",
                "openadr-home"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            }
          }
        },
        {
          "slug": "open-grid-data-community-microgrids",
          "name": "Open grid data and community microgrids",
          "summary": "Community groups, municipalities, cooperatives, and independent developers use open infrastructure data, open-source planning tools, and local generation to design resilient microgrids that can island critical loads while still interconnecting with the regulated utility grid.",
          "angleIds": [
            "microgrid-coordination",
            "open-energy-hardware",
            "cooperative-production"
          ],
          "thesis": "More planning intelligence and operational resilience moves to communities and campuses, reducing the incumbent's exclusive role as the only practical planner of local energy resilience.",
          "bitcoinOrDecentralizationRole": "The decentralization role is open data and cooperative local ownership. Bitcoin is not central because the hard problem is physical planning, interconnection, and reliability rather than monetary settlement.",
          "coordinationMechanism": "Participants map infrastructure, identify critical loads, finance shared solar and storage, operate a local controller, and coordinate islanding or grid support through interconnection agreements.",
          "verificationOrTrustModel": "Open infrastructure maps can be inspected by many contributors, while microgrid operation depends on metered generation, storage state, interconnection equipment, and utility-visible protection systems. The weak point is that public maps and engineering models must be validated before operational decisions rely on them.",
          "failureModes": [
            "Open map data may be incomplete, stale, or unsuitable for engineering-grade protection studies.",
            "Interconnection queues, permitting, and utility operating rules can slow or block community projects.",
            "Financing and maintenance burdens may fall unevenly unless governance is carefully designed."
          ],
          "adoptionPath": [
            "Use open grid maps and community energy monitoring to identify resilience gaps around schools, shelters, hospitals, and local commercial centers.",
            "Build small microgrids with solar, storage, controllable loads, and open management software.",
            "Standardize interconnection and operating rules so qualified community systems can support the wider grid during normal conditions and island during outages."
          ],
          "confidence": "medium",
          "problemSourceIds": [
            "dominion-2025-10k",
            "dominion-ir-profile-2026"
          ],
          "enablerSourceIds": [
            "openinframap-about",
            "openems-home",
            "openenergymonitor-about"
          ],
          "metrics": {
            "decentralizationFit": {
              "value": 72,
              "rationale": "Community microgrids decentralize resilience, local generation, and some operational planning while remaining tied to the larger grid.",
              "sourceIds": [
                "openinframap-about",
                "openems-home"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "coordinationCredibility": {
              "value": 59,
              "rationale": "Open data and open-source tools improve coordination, but the concept still depends on utilities, regulators, engineers, and local owners agreeing on operational rules.",
              "sourceIds": [
                "openinframap-about",
                "openenergymonitor-about"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "implementationFeasibility": {
              "value": 53,
              "rationale": "Microgrid components are real, but engineering validation, protection equipment, interconnection, and financing make deployment slower than software-only alternatives.",
              "sourceIds": [
                "openems-home",
                "dominion-2025-10k"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "incumbentPressure": {
              "value": 47,
              "rationale": "Community microgrids can reduce outage dependence and peak demand, but they usually complement rather than fully replace the incumbent distribution utility.",
              "sourceIds": [
                "dominion-ir-profile-2026",
                "openinframap-about"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            }
          }
        }
      ]
    },
    {
      "slug": "natural-gas-service",
      "name": "Natural gas service",
      "category": "Regulated natural gas service",
      "homepageUrl": "https://www.dominionenergy.com/",
      "summary": "Dominion provides regulated natural gas service to customers in South Carolina through its utility operations.",
      "whyItMatters": "Natural gas service locks households and businesses into fuel delivery, pipes, appliance choices, rate recovery, and long-lived infrastructure that can conflict with electrification and local thermal-energy alternatives.",
      "replacementSketch": [
        "The realistic replacement path is gradual electrification and shared thermal infrastructure rather than another molecule-delivery monopoly. Heat pumps, building efficiency, networked geothermal, and open monitoring can reduce gas throughput while preserving comfort and reliability.",
        "For customers, the strongest alternative is a local stack: transparent energy monitoring, electrified appliances, community thermal loops where dense enough, and financing structures that avoid stranding low-income customers on a shrinking gas network."
      ],
      "sourceIds": [
        "dominion-ir-profile-2026",
        "dominion-2025-10k",
        "heet-thermal-networks",
        "openenergymonitor-about"
      ],
      "technologyWaveIds": [
        "distributed-energy"
      ],
      "alternatives": [
        {
          "slug": "natural-gas-service-openenergymonitor",
          "name": "OpenEnergyMonitor",
          "kind": "open-source",
          "homepageUrl": "https://openenergymonitor.org/",
          "repoUrl": "https://github.com/openenergymonitor",
          "summary": "OpenEnergyMonitor provides open-source tools for monitoring electricity, solar, storage, heat pumps, EV charging, and broader home energy use.",
          "metrics": {
            "openness": {
              "value": 86,
              "rationale": "The project presents itself as open source and publishes code and documentation for energy monitoring tools.",
              "sourceIds": [
                "openenergymonitor-about",
                "emoncms-github"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "decentralizationFit": {
              "value": 61,
              "rationale": "Open monitoring gives households and installers local visibility into energy use and electrification performance, but it does not by itself replace utility fuel delivery.",
              "sourceIds": [
                "openenergymonitor-about"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "readiness": {
              "value": 70,
              "rationale": "The project has mature public documentation and software, though deployment still requires sensors, installation, and user competence.",
              "sourceIds": [
                "openenergymonitor-docs",
                "emoncms-github"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "costLeverage": {
              "value": 58,
              "rationale": "Better monitoring can guide efficiency and electrification investments, but major savings require capital upgrades such as heat pumps, insulation, or thermal networks.",
              "sourceIds": [
                "openenergymonitor-about"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            }
          },
          "sourceIds": [
            "openenergymonitor-about",
            "openenergymonitor-docs",
            "emoncms-github"
          ]
        },
        {
          "slug": "thermal-energy-networks",
          "name": "Thermal energy networks",
          "kind": "cooperative",
          "homepageUrl": "https://heet.org/",
          "summary": "Thermal energy networks are shared geothermal or ambient-loop systems that can heat and cool buildings without delivering natural gas to each customer.",
          "metrics": {
            "openness": {
              "value": 45,
              "rationale": "Thermal networks are an infrastructure model rather than a single open-source project; openness depends on governance, procurement, and data-sharing choices.",
              "sourceIds": [
                "heet-thermal-networks"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "decentralizationFit": {
              "value": 67,
              "rationale": "They can move heating and cooling toward neighborhood-scale shared infrastructure instead of a centralized gas-delivery monopoly.",
              "sourceIds": [
                "heet-thermal-networks"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "readiness": {
              "value": 46,
              "rationale": "The concept is technically grounded but site-specific, capital-intensive, and dependent on local utility, municipal, and building coordination.",
              "sourceIds": [
                "heet-thermal-networks"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "costLeverage": {
              "value": 54,
              "rationale": "Shared thermal loops can reuse workforce skills and reduce fossil fuel dependence, but upfront civil works and retrofit costs are significant.",
              "sourceIds": [
                "heet-thermal-networks"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            }
          },
          "sourceIds": [
            "heet-thermal-networks"
          ]
        }
      ],
      "disruptionConcepts": [
        {
          "slug": "neighborhood-thermal-cooperatives",
          "name": "Neighborhood thermal cooperatives",
          "summary": "Customers, municipalities, and skilled utility workers form neighborhood thermal networks that provide shared heating and cooling through geothermal or ambient-loop infrastructure, reducing reliance on natural gas throughput.",
          "angleIds": [
            "cooperative-production",
            "decentralized-coordination",
            "microgrid-coordination"
          ],
          "thesis": "The gas utility's role as a fuel-delivery monopoly weakens as neighborhoods coordinate shared thermal infrastructure and building electrification instead of paying for expanding or maintaining gas pipes indefinitely.",
          "bitcoinOrDecentralizationRole": "The decentralization role is cooperative ownership and local infrastructure coordination. Bitcoin is not central because trust is anchored in physical metering, municipal oversight, and cooperative governance rather than digital scarcity.",
          "coordinationMechanism": "Building owners join a district project, finance shared borefields or thermal loops, install heat-pump interfaces, and govern rates and maintenance through a cooperative, municipal, or regulated utility structure.",
          "verificationOrTrustModel": "Thermal meters, audited construction records, maintenance logs, and transparent cooperative accounting verify delivered service and cost allocation. The main trust challenge is preventing cost shifting between early adopters, renters, and customers left on the legacy gas system.",
          "failureModes": [
            "High upfront construction costs and street disruption can make projects politically difficult.",
            "Poor governance could shift costs onto renters or customers unable to electrify quickly.",
            "Thermal networks may be uneconomic in low-density areas or buildings with weak efficiency."
          ],
          "adoptionPath": [
            "Start with dense neighborhoods, campuses, public buildings, or gas-pipe replacement zones where avoided gas infrastructure costs are visible.",
            "Combine open monitoring, building efficiency, heat pumps, and shared thermal loops under transparent local governance.",
            "Use regulatory proceedings to compare thermal-network investment against continued gas-pipe replacement and stranded-asset risk."
          ],
          "confidence": "medium",
          "problemSourceIds": [
            "dominion-ir-profile-2026",
            "dominion-2025-10k"
          ],
          "enablerSourceIds": [
            "heet-thermal-networks",
            "openenergymonitor-about"
          ],
          "metrics": {
            "decentralizationFit": {
              "value": 69,
              "rationale": "Neighborhood thermal networks move heating and cooling infrastructure toward local shared ownership or governance rather than centralized fuel delivery.",
              "sourceIds": [
                "heet-thermal-networks"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "coordinationCredibility": {
              "value": 58,
              "rationale": "The model has a clear coordination story among utilities, workers, municipalities, and customers, but each deployment requires difficult local agreement.",
              "sourceIds": [
                "heet-thermal-networks"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "implementationFeasibility": {
              "value": 49,
              "rationale": "The engineering is plausible, but retrofits, street works, utility regulation, and financing make implementation materially harder than appliance-level electrification.",
              "sourceIds": [
                "heet-thermal-networks",
                "openenergymonitor-about"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "incumbentPressure": {
              "value": 57,
              "rationale": "If deployed in gas-replacement zones, thermal networks could directly reduce future gas rate-base growth and throughput, but scale is uncertain.",
              "sourceIds": [
                "dominion-2025-10k",
                "heet-thermal-networks"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            }
          }
        },
        {
          "slug": "open-home-electrification-performance-layer",
          "name": "Open home electrification performance layer",
          "summary": "Open-source monitoring and control tools measure gas displacement, heat-pump performance, comfort, and electricity impacts so households and local programs can verify whether electrification is working before committing to broader gas-system retirement.",
          "angleIds": [
            "open-energy-hardware",
            "decentralized-coordination",
            "recycling-and-reuse"
          ],
          "thesis": "The information advantage shifts from the gas utility and appliance vendors toward households, installers, community programs, and regulators that can inspect real-world performance data.",
          "bitcoinOrDecentralizationRole": "Decentralization matters through user-controlled monitoring and auditable local data. Bitcoin is not central because the key bottleneck is trusted building-performance evidence, not open monetary settlement.",
          "coordinationMechanism": "Households deploy open monitors, installers publish anonymized performance benchmarks, community programs compare retrofit outcomes, and regulators use verified data to target incentives and gas-retirement plans.",
          "verificationOrTrustModel": "Device readings can be checked against utility bills, weather data, equipment specifications, and before-and-after baselines. Cheating is constrained by cross-checks, but privacy-preserving aggregation and calibration standards are necessary.",
          "failureModes": [
            "Sensor miscalibration or poor installation can produce misleading savings claims.",
            "Privacy concerns could prevent useful data sharing.",
            "Monitoring alone does not solve financing, contractor quality, or grid-capacity constraints."
          ],
          "adoptionPath": [
            "Begin with voluntary monitoring for heat-pump adopters and high-bill households.",
            "Aggregate anonymized performance data by building type, weather zone, and retrofit package.",
            "Tie incentives and gas-retirement planning to measured performance rather than generic assumptions."
          ],
          "confidence": "medium",
          "problemSourceIds": [
            "dominion-ir-profile-2026"
          ],
          "enablerSourceIds": [
            "openenergymonitor-about",
            "emoncms-github",
            "openenergymonitor-docs"
          ],
          "metrics": {
            "decentralizationFit": {
              "value": 63,
              "rationale": "The concept decentralizes measurement and decision support to households and communities, though it does not itself provide replacement energy.",
              "sourceIds": [
                "openenergymonitor-about"
              ],
              "confidence": "high",
              "lastReviewedOn": "2026-06-01"
            },
            "coordinationCredibility": {
              "value": 61,
              "rationale": "Open monitoring, shared benchmarks, and bill cross-checks are credible coordination primitives for retrofit programs.",
              "sourceIds": [
                "openenergymonitor-docs",
                "emoncms-github"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "implementationFeasibility": {
              "value": 66,
              "rationale": "Monitoring software and hardware ecosystems already exist, making this easier to deploy than new thermal infrastructure, though quality standards remain necessary.",
              "sourceIds": [
                "openenergymonitor-about",
                "emoncms-github"
              ],
              "confidence": "medium",
              "lastReviewedOn": "2026-06-01"
            },
            "incumbentPressure": {
              "value": 42,
              "rationale": "Better data can accelerate electrification and gas-retirement planning, but pressure on the incumbent is indirect unless tied to policy and financing.",
              "sourceIds": [
                "dominion-ir-profile-2026",
                "openenergymonitor-about"
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
    "id": "dominion-2025-10k",
    "title": "2025 Combined Form 10-K",
    "url": "https://s2.q4cdn.com/510812146/files/doc_downloads/2026/2025-Combined-Form-10-K-FINAL-FILED.pdf",
    "kind": "annual-report",
    "publisher": "Dominion Energy",
    "note": "Annual report source for regulated utility operations, infrastructure, risks, and business context.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "dominion-2025-results",
    "title": "Dominion Energy announces 2025 financial results",
    "url": "https://investors.dominionenergy.com/news/press-release-details/2026/Dominion-Energy-announces-2025-financial-results/default.aspx",
    "kind": "investor-relations",
    "publisher": "Dominion Energy",
    "note": "Primary earnings release used for 2025 net income and profitability context.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "dominion-ir-profile-2026",
    "title": "Investor Relations",
    "url": "https://investors.dominionenergy.com/HOME/",
    "kind": "investor-relations",
    "publisher": "Dominion Energy",
    "note": "Company profile source for Dominion's regulated electric and natural gas customer footprint and business description.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "dominion-marketcap-2026",
    "title": "Dominion Energy (D) - Market capitalization",
    "url": "https://companiesmarketcap.com/dominion-energy/marketcap/",
    "kind": "market-data",
    "publisher": "CompaniesMarketCap",
    "note": "Market capitalization source for the refreshed public-company snapshot.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "emoncms-github",
    "title": "Emoncms GitHub Repository",
    "url": "https://github.com/emoncms/emoncms",
    "kind": "open-source-project",
    "publisher": "OpenEnergyMonitor",
    "note": "Repository source for the open-source web application used to process, log, and visualize energy and environmental data.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "heet-thermal-networks",
    "title": "HEET Networking Thermal Energy",
    "url": "https://heet.org/",
    "kind": "analysis",
    "publisher": "HEET",
    "note": "Thermal energy network source for gas-to-geothermal replacement concepts and community-scale heating and cooling alternatives.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "nextera-dominion-merger-2026",
    "title": "NextEra Energy and Dominion Energy to Combine",
    "url": "https://investors.dominionenergy.com/news/press-release-details/2026/NextEra-Energy-and-Dominion-Energy-to-Combine-Creating-the-Worlds-Largest-Regulated-Electric-Utility-Business-and-North-Americas-Premier-Energy-Infrastructure-Platform-Benefiting-Customers/default.aspx",
    "kind": "investor-relations",
    "publisher": "Dominion Energy",
    "note": "Announced combination source used to flag current strategic context without changing the Dominion company snapshot.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openadr-der-factsheet",
    "title": "Using OpenADR for DER",
    "url": "https://www.openadr.org/assets/docs/openadr_der_factsheet_pdfx4.pdf",
    "kind": "technical-docs",
    "publisher": "OpenADR Alliance",
    "note": "Technical fact sheet supporting OpenADR's role in managing distributed energy resources.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openadr-home",
    "title": "OpenADR Alliance",
    "url": "https://www.openadr.org/",
    "kind": "technical-docs",
    "publisher": "OpenADR Alliance",
    "note": "Describes OpenADR as a standard for automated demand response and distributed energy resource coordination.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openems-github",
    "title": "OpenEMS GitHub Repository",
    "url": "https://github.com/OpenEMS/openems",
    "kind": "open-source-project",
    "publisher": "OpenEMS",
    "note": "Public source repository for the OpenEMS open-source energy management platform.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openems-home",
    "title": "OpenEMS",
    "url": "https://openems.io/",
    "kind": "open-source-project",
    "publisher": "OpenEMS Association",
    "note": "Open-source energy management platform for coordinating renewable generation, storage, grid, and loads.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openenergymonitor-about",
    "title": "OpenEnergyMonitor",
    "url": "https://openenergymonitor.org/homepage/about",
    "kind": "open-source-project",
    "publisher": "OpenEnergyMonitor",
    "note": "Open-source monitoring source for electricity, solar, storage, heat pumps, EV charging, and household energy visibility.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openenergymonitor-docs",
    "title": "OpenEnergyMonitor Documentation",
    "url": "https://openenergymonitor.org/docs/",
    "kind": "technical-docs",
    "publisher": "OpenEnergyMonitor",
    "note": "Documentation source for OpenEnergyMonitor deployment and monitoring capabilities.",
    "accessedOn": "2026-06-01"
  },
  {
    "id": "openinframap-about",
    "title": "Open Infrastructure Map",
    "url": "https://openinframap.org/about",
    "kind": "open-source-project",
    "publisher": "Open Infrastructure Map",
    "note": "Open infrastructure data source showing power and other infrastructure from OpenStreetMap for community planning concepts.",
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
