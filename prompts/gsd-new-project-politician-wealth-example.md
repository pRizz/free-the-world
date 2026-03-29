# Politician Wealth Research Registry Seed For `$gsd-new-project`

I want to build a thesis-driven research website that makes it painfully legible how wealthy United States politicians are, what they own, how their holdings compare to the median American, and how far elite political life has drifted from ordinary economic reality.

Treat this as strong initial context for `$gsd-new-project`, but still do the full questioning process to tighten scope, trust rules, and rollout sequence.

## What This Project Is

Build a content-first research registry site about politicians, their wealth, their holdings, their incomes, and the benchmark comparisons that make those numbers meaningful.

The site should combine:

- strong infographics on the homepage;
- searchable catalog pages for politicians;
- politician detail pages with source trails and comparison views;
- grouping pages for state, region, party, chamber, committee, and other useful taxonomies;
- benchmark pages for the median American and other defensible baselines;
- deeper articles explaining the loopholes, disclosure limits, patterns, and institutional absurdities underneath the numbers.

This should look polished, serious, and editorial. The tone should be professional with a subtle satirical edge. The satire should feel like dry commentary, not internet slapstick.

## Core Thesis

The broad idea is that American political leadership often governs as if it speaks for ordinary citizens while living in a financial universe that is dramatically wealthier, more asset-heavy, and more market-exposed than the median American household.

I want the site to make that gap impossible to ignore.

The site should not pretend the data is perfect. It should explicitly explain disclosure ranges, blind spots, stale filings, reporting loopholes, and estimation limits. The goal is auditable judgment, not fake certainty.

## Recommended Stack

Strongly prefer the same general stack used in this repo unless the questioning process proves that the project needs a live authenticated product, collaborative workflows, or infrastructure-heavy data access that a content-first static model would fight.

Recommended default stack:

- Bun for package management, script orchestration, tests, and research/content pipeline tasks.
- SolidStart on Vinxi with a static preset and explicit prerendering.
- SolidJS for routes and page composition.
- Kobalte for accessible UI primitives, wrapped in local components.
- Tailwind CSS v4 plus `class-variance-authority` for typed reusable variants.
- TypeScript throughout.

This is the right default for this politician-wealth site because the product is primarily:

- public-source and publication-oriented;
- infographic-heavy and comparison-heavy;
- SEO-sensitive at the route level;
- better served by cheap static hosting than by app infrastructure in v1;
- likely to benefit more from a strong content pipeline than from a database-first admin surface on day one.

If later questioning uncovers a real need for authenticated editing, live alerts, or complex real-time data products, revisit the stack then. Otherwise stay close to this one.

## Default Site Structure

Assume the initial product shape includes:

1. A homepage with infographics showing the scale of the wealth gap and the main narrative frames.
2. A methodology page explaining how net worth estimates, holdings, income fields, benchmark comparisons, and freshness rules work.
3. Catalog pages for politicians with filters and sorting.
4. Detail pages for individual politicians.
5. Cluster pages for state, region, party, chamber, committee, office level, and similar groupings.
6. Benchmark pages comparing politicians to the median American and other useful baselines.
7. Explainer articles on topics like disclosure forms, stock ownership, office salaries versus actual wealth, and where the data is weak or strategically obscured.

## Subject Model

Default conceptual interfaces:

- `SubjectManifest`: one politician or officeholder. Includes identity, office, jurisdiction, taxonomy memberships, benchmark links, source seeds, and the core financial fields to research.
- `ClusterTaxonomy`: state, region, party, chamber, committee, office level, election cycle, or other grouping systems that help readers navigate the catalog.
- `BenchmarkRecord`: comparison baselines such as the median American household, median worker, state-level baselines, or other defensible reference points.
- `SourceCitation`: structured source records with title, URL, publisher, date, access notes, and a short why-it-matters field.
- `BackfillRequest`: raw batch requests such as "queue all politicians in the Midwest", "refresh every senator", or "run everyone in this committee".
- `ResearchRunArtifact`: non-canonical loop outputs, normalized data files, validation reports, and publish traces.

Keep raw intake, queued manifests, research artifacts, and canonical published data as separate layers.

## Design Conventions To Preserve

Preserve the design and architecture choices that make this repo effective:

- wrap Kobalte primitives in small local UI components rather than using raw primitives directly across page files;
- use typed variant helpers with `class-variance-authority`, `clsx`, and `tailwind-merge` for consistent buttons, cards, badges, and related primitives;
- keep a dedicated theme layer with CSS variables and tokenized visual values;
- build reusable editorial blocks such as page headers, cards, badges, button links, and SEO wrappers;
- keep canonical content repo-tracked and compile it into a generated runtime layer before rendering;
- generate static routes from the content model and prerender them explicitly;
- favor infographic-first composition, clean information hierarchy, and visible source breadcrumbs over dashboard clutter.

## Data And Comparison Defaults

The main subject metrics should include, at minimum:

- estimated net worth or defensible disclosed net worth range;
- salary or other known income streams tied to office;
- stock holdings and other major asset holdings when disclosed;
- disclosure-derived financial signals such as large sector exposure, concentration, or repeated trading activity;
- benchmark comparisons against the median American or median household;
- source freshness and confidence notes.

Design the schema so it can evolve as source quality improves. Some values will be ranges, some will be estimates, and some will be materially incomplete. That ambiguity should be surfaced, not hidden.

## Research And Backfill Workflow

I want the workflow to be Ralph-loop-first and as "set it and forget it" as possible.

Operationally, I want to be able to say things like:

- "Queue all politicians in the Midwest."
- "Queue every current senator."
- "Refresh all politicians from this state."
- "Backfill the committee leadership cluster."

The expected workflow is:

1. Create a raw `BackfillRequest` from a phrase, list, or grouping.
2. Resolve that request into candidate politicians.
3. Turn candidates into queued `SubjectManifest` records.
4. Run Ralph-style loops over the queue to collect, normalize, and summarize financial data plus source suggestions.
5. Validate outputs before publish.
6. Publish only canonical records that clear the rules.
7. Support reruns for stale, incomplete, or newly expanded slices.

Set-it-and-forget-it batch automation is a first-class requirement, not a nice extra.

## Trust And Methodology Requirements

The site should be aggressive in framing and careful in sourcing.

Default trust principles:

- prefer official disclosure filings and primary records where available;
- use secondary sources to interpret or contextualize, not to replace primary evidence when primary evidence exists;
- make uncertainty visible;
- distinguish hard facts from estimates and editorial interpretation;
- keep visible source breadcrumbs on every page;
- make the methodology page strong enough that a skeptical reader can audit the site rather than dismiss it as partisan theater.

## Scope Pressure To Question Early

During initialization, push hard on these unresolved points:

- whether v1 should cover Congress only, all current federal officeholders, or a broader universe of politicians;
- which benchmark baselines are the most defensible and least misleading;
- how to handle disclosure ranges, stale records, and partial holdings data;
- which taxonomy slices matter most in v1;
- what refresh cadence the source ecosystem realistically supports;
- where the line is between editorial inference and unsupported insinuation.

## Implementation Defaults

Default to a static research site with repo-tracked content, generated runtime data, and minimal infrastructure in v1.

Before major implementation work, create at least:

- `README.md` with the thesis and scope;
- `docs/architecture.md` with the site, content, and pipeline shape;
- `docs/protocols.md` with schemas and workflow interfaces;
- `docs/research.md` with source categories, trust rules, and open methodological questions.

Assume these implementation defaults unless questioning proves otherwise:

- Bun-driven scripts for queueing, content compile, validation, tests, and batch research orchestration;
- SolidStart/Vinxi static export with explicit prerendering from content-driven routes;
- route-level SEO and canonical metadata as a first-class concern;
- local wrapped Kobalte primitives and reusable editorial components;
- Tailwind tokenization with a dedicated theme layer and typed variants;
- no database-first architecture before the content-first approach shows a real scaling failure.

Do not assume a database-first design unless the questioning process proves that repo-tracked content will fail the expected scale or maintenance cadence.

## Bright Builds Requirement Adoption

Adopt the Bright Builds coding and architecture requirements very early, before significant implementation work.

Repository:
- [bright-builds-llc/coding-and-architecture-requirements](https://github.com/bright-builds-llc/coding-and-architecture-requirements)

Primary references:
- [README](https://github.com/bright-builds-llc/coding-and-architecture-requirements)
- [AI-ADOPTION.md](https://raw.githubusercontent.com/bright-builds-llc/coding-and-architecture-requirements/main/AI-ADOPTION.md)

Follow this exact decision flow:

1. Confirm you are in the root of the downstream repository.
2. Run:

```bash
curl -fsSL https://raw.githubusercontent.com/bright-builds-llc/coding-and-architecture-requirements/main/scripts/manage-downstream.sh | bash -s -- status
```

3. If status reports `Repo state: installable`, run:

```bash
curl -fsSL https://raw.githubusercontent.com/bright-builds-llc/coding-and-architecture-requirements/main/scripts/manage-downstream.sh | bash -s -- install --ref main
```

4. If status reports `Repo state: installed`, run:

```bash
curl -fsSL https://raw.githubusercontent.com/bright-builds-llc/coding-and-architecture-requirements/main/scripts/manage-downstream.sh | bash -s -- update --ref main
```

5. If status reports `Repo state: blocked`, stop and explain the blocking files instead of forcing replacement automatically.
6. Only use `install --force` if the user explicitly asks to replace blocked managed files.
7. After installation or update, mention `coding-and-architecture-requirements.audit.md` as the paper trail.

## Success Criteria For The First Meaningful Slice

The first meaningful version should usually include:

- a homepage with one or more strong politician-wealth infographics;
- a methodology page that clearly explains uncertainty and source rules;
- a catalog page for the initial politician set;
- an individual politician detail page template;
- at least one grouping page such as state or region;
- at least one benchmark comparison page against the median American;
- at least one explainer article about disclosure mechanics or systemic patterns;
- one functioning backfill pipeline that can queue a batch and drive it through Ralph-style research and validated publish.

Out of scope by default unless questioning proves otherwise:

- user accounts;
- community features;
- real-time market feeds;
- speculative accusations unsupported by sourceable evidence;
- a database-first architecture before the content-first version proves insufficient.
