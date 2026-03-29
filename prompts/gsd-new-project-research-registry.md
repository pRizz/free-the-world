# Research Registry Site Seed For `$gsd-new-project`

I want to build a thesis-driven research registry website. Treat this brief as strong starting context for `$gsd-new-project`, but still do the full questioning process anywhere the scope, trust model, or rollout details remain unclear.

## What I Want To Build

Build a content-first research site that:

- catalogs a large set of subjects in a way that is structured, searchable, and sourceable;
- compares those subjects against benchmark groups or baseline records that make the story legible;
- uses clean infographics, concise index pages, subject detail pages, and deeper explainer essays;
- presents an explicit worldview instead of pretending the site is a neutral spreadsheet that descended from heaven;
- keeps a professional tone with a restrained satirical edge rather than turning into a meme site.

This should feel like a sharp editorial research product with strong information design, not a generic dashboard and not a CMS-heavy publication.

## Default Site Formula

Assume the default site structure includes:

1. An infographic-forward homepage that communicates the thesis, the most important headline numbers, and the "why this matters" framing.
2. A methodology page that explains assumptions, scoring, source quality, freshness rules, and known blind spots.
3. Catalog or index pages for browsing the full subject set with useful filters and sorting.
4. Subject detail pages that combine factual records, benchmark comparisons, charts, and source trails.
5. Cluster pages for meaningful groupings such as region, state, party, chamber, sector, theme, or other taxonomy slices.
6. Benchmark or comparison pages that explain the baseline entities and why those comparisons are defensible.
7. Article or explainer pages that go deeper on important narratives, loopholes, categories, or systemic patterns.

The interface should be clean, editorial, and intentional. It should privilege readability, charts, and hierarchy over dashboard clutter. The humor should be dry and subtle.

## Editorial Stance

Use these tone defaults unless I later override them:

- Professional first.
- Restrained satire second.
- Explicit thesis, not fake neutrality.
- Auditable judgment with visible sourcing.
- Strong writing, not bland institutional copy.
- Serious visual design, not novelty graphics for their own sake.

The site should say, in effect, "here is the evidence, here is the interpretation, and here is why the official story deserves less deference than usual."

## Recommended Stack

Strongly prefer the same general stack shape used here unless the product clearly needs real-time collaboration, heavy authenticated app behavior, or a data volume that would make repo-tracked content unworkable.

Recommended default stack:

- Bun for package management, script orchestration, tests, and content pipeline tasks.
- SolidStart on Vinxi with a static preset and explicit prerendering.
- SolidJS for the application and route layer.
- Kobalte for accessible UI primitives, wrapped in local project components instead of used raw across the app.
- Tailwind CSS v4 for styling, with typed variants built on `class-variance-authority`.
- TypeScript throughout.

This is the default recommendation for projects like this because it supports:

- fast static output and cheap hosting;
- simple Bun-driven build, content, and research scripts;
- strong route-level SEO and canonical metadata handling;
- a good ergonomic fit for content-heavy, infographic-heavy pages;
- accessible interaction primitives without adopting an oversized component framework;
- minimal infrastructure pressure in v1.

If the questioning process confirms that the site is mainly a public-source, SEO-sensitive, content-first editorial product, stay close to this stack. Only diverge when the product requirements clearly justify it.

## Information Architecture And Data Model

Default to a repo-tracked, content-first system with explicit separation between raw intake, queued work, research artifacts, and canonical published data.

Use these conceptual interfaces as the default downstream model:

- `SubjectManifest`: the core identity and seed record for one subject. Includes slug, name, taxonomy membership, benchmark links, source seeds, key metrics to fill, and editorial notes.
- `ClusterTaxonomy`: controlled vocabularies for grouping subjects such as state, region, category, party, chamber, sector, theme, or cohort.
- `BenchmarkRecord`: baseline entities or aggregates used for comparison, such as a median person, median household, peer group, or regional baseline.
- `SourceCitation`: structured source metadata with URL, title, publisher, date, access note, and why the source matters.
- `BackfillRequest`: a raw operator request like "queue all subjects in the Midwest" or "refresh everyone in this party". This is the intake object for batch work.
- `ResearchRunArtifact`: non-canonical research outputs from loops, validations, normalized data, summaries, or publish traces.

Keep raw intake, queued entries, research artifacts, and canonical published content as separate layers. Do not collapse everything into one mutable table just because that is easy on day one.

## Research And Backfill Workflow

The research engine should be Ralph-loop-first and as close to "set it and forget it" as the trust model allows.

The default workflow should look like this:

1. A user submits a raw intake request, a direct subject, or a grouping phrase.
2. The system creates a `BackfillRequest` and resolves it into candidate subjects.
3. Candidate subjects become queued manifest records rather than being published directly.
4. Ralph-style loops run over those queued subjects one at a time, collecting or normalizing structured facts, narrative summaries, benchmark mappings, and source suggestions.
5. Validation gates check schema shape, taxonomy alignment, source completeness, and other quality rules before publish.
6. Only validated outputs become canonical published content.
7. The same workflow supports reruns for stale data, incomplete data, newly added clusters, or refreshed source material.

Operationally, I want to be able to say things like:

- "Queue all subjects in this region."
- "Backfill everyone in this taxonomy slice."
- "Refresh the stale benchmark comparisons."
- "Run the pipeline for this queued batch and publish only validated records."

Favor repeatable batch workflows, dry-run modes, and idempotent reruns over manual hand-crafted entry.

## Design Conventions To Preserve

Preserve the architectural and UI patterns that make this repo coherent:

- Wrap Kobalte primitives in small local UI components and higher-level editorial blocks instead of spreading primitive usage directly through page files.
- Use typed variant utilities with `class-variance-authority`, `clsx`, and `tailwind-merge` so buttons, cards, badges, and similar primitives stay consistent.
- Keep a dedicated theme layer with tokenized CSS variables for colors, radius, and shared visual values instead of scattering raw values across components.
- Build reusable editorial blocks such as page headers, content cards, badges, button links, and SEO helpers so route files compose content instead of hand-building layout every time.
- Keep canonical content repo-tracked and compile it into a generated runtime graph or equivalent derived layer before app runtime.
- Generate static routes from content and prerender them explicitly instead of relying on ad hoc route growth or crawl-only discovery.
- Favor infographic-forward homepage composition, strong section hierarchy, visible source trails, and content that reads like editorial research rather than a control panel.

## Implementation Defaults

Default to a static research site with repo-tracked content and generated runtime data unless the questioning process surfaces a real need for a database or authenticated app.

Assume these defaults:

- content-first static architecture;
- Bun-driven scripts for content compile, validation, testing, and build orchestration;
- SolidStart/Vinxi static export with explicit content-driven prerendered routes;
- repo-tracked JSON or Markdown content;
- generated content graph or equivalent derived runtime layer;
- route-level SEO helpers and canonical URL handling;
- local wrapped Kobalte primitives and reusable editorial UI blocks;
- Tailwind tokenization with a dedicated theme layer and typed variants;
- explicit schema contracts before broad implementation;
- minimal external services in v1;
- no database-first design unless scale or update cadence clearly justifies it;
- no admin UI in v1 unless manual repo editing is clearly the bottleneck.

Before major implementation work, produce at least:

- `README.md` with the thesis and project scope;
- `docs/architecture.md` describing the system shape;
- `docs/protocols.md` describing schemas, contracts, or workflow interfaces;
- `docs/research.md` capturing domain assumptions, alternatives, and what the project will not do yet.

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

## Questioning Priorities

During project initialization, push hard on these questions:

- Who exactly belongs in the subject catalog, and who is out of scope?
- Which benchmark comparisons are truly defensible and useful?
- Which groupings or taxonomies matter most to readers?
- Which facts are mandatory for publication versus nice to have?
- Which sources are primary, which are secondary, and where are the trust gaps?
- How fresh does the data need to be, and what rerun cadence matters?
- Which parts of the pipeline must be fully automated versus editor-reviewed?
- What legal, reputational, or methodological caveats need to be explicit from the start?

## Success Criteria For The First Meaningful Slice

The first meaningful version should usually include:

- one homepage with a strong infographic and a clear thesis;
- one methodology page that explains the site's declared biases and source rules;
- one catalog view;
- one subject detail page template;
- one cluster or grouping page;
- one benchmark comparison view;
- one deeper explainer article;
- one functioning raw-intake to queue to Ralph-loop to validated-publish workflow for a sample batch.

Out of scope by default unless the questioning process proves otherwise:

- user accounts;
- social features;
- generic CMS complexity;
- live dashboards that require real-time infrastructure;
- a database-first architecture without a demonstrated need.
