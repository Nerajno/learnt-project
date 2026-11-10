# #25 triage: full draft (all 42 projects)

Draft for [#25](https://github.com/Nerajno/learnt-project/issues/25). Supersedes the blank [batch 1 worksheet](25-triage-batch-1.md), which stays as the record of its date method.

## How to use this

- **Every value in the Draft column is mine, not yours.** Fix it, or write your own in "Your answer". Leave "Your answer" empty to accept the draft.
- **Sources only:** drafts come from what is already in `src/data/projects.ts` (description, features, learnings, challenges, retrospective) and your GitHub commit dates. No invented numbers. Where the evidence runs out it says _needs you_.
- **Epitaphs** need your voice most. Where a retrospective existed I borrowed its line.
- **Count:** the data has 42 projects, not the 44 #25 mentions.
- **Fields:** `outcome` and `impact` are drafted for headstones and markers (coursework only needs `epitaph`). `causeOfDeath` follows the schema: open projects have none, shipped ones can only be `shipped`, composted ones need one of `superseded`, `outgrew-stack`, `course-ended`, `abandoned`, `merged-into`. `superseded` and `merged-into` need `supersededBy`.
- **Skill tags** are market terms for the card face (max 4). The playful tags stay as filter-only tags.
- **Dates:** git = first/last commit authored by `Nerajno` (GitHub API, 2026-11-09). Re-uploads and forks skew git, so each project says which source I picked and why.

When you're done, hand it back and I'll apply it to `src/data/projects.ts` in one PR.

## Summary

| Project | Tier | Stage | Cause | Dates from |
|---|---|---|---|---|
| [Portfolio V3](#portfolio-v3) | marker | sprout | — | git |
| [Learnt Project](#learnt-project) | marker | sprout | — | git |
| [Digital Garden](#digital-garden) | marker | sprout | — | git |
| [Is Nerando Done Yet](#is-nerando-done-yet) | marker | sprout | — | data |
| [My Digital Mausoleum](#digital-mausoleum) | marker | sprout | — | data |
| [Learnt V2](#learnt-v2) | marker | composted | superseded | data |
| [Learnt V1](#learnt-v1) | marker | composted | superseded | git |
| [Side Project Status Tracker](#side-project-status) | marker | composted | superseded | data |
| [Burble V1](#burble-v1) | headstone | composted | abandoned | data |
| [FreeCodeCamp Calculator](#fcc-calculator) | coursework | shipped | shipped | data |
| [Drum Machine - Trumma](#trumma-drum-machine) | marker | shipped | shipped | data |
| [JavaScript30](#javascript30) | coursework | shipped | shipped | git |
| [Vue Conference Workshop](#vue-conf-workshop) | marker | shipped | shipped | needs you |
| [FCC D3 Bar Chart](#fcc-d3-bars) | coursework | shipped | shipped | data |
| [FCC D3 Story](#fcc-d3-story) | headstone | shipped | shipped | data |
| [Vue Holiday Card Maker](#vue-holiday-card) | marker | shipped | shipped | needs you |
| [Assaggio FCC Project](#assaggio-fcc) | coursework | shipped | shipped | git |
| [bRavur FCC Project](#bravur-fcc) | coursework | shipped | shipped | data |
| [Toppur FCC Project](#toppur-fcc) | coursework | shipped | shipped | data |
| [Current Portfolio 2023](#portfolio-2023) | marker | composted | superseded | git |
| [Hosted Blog V3](#hosted-blog-v3) | marker | composted | outgrew-stack | git |
| [Astro Blog](#astro-blog) | marker | composted | abandoned | data |
| [MDX Blog with Next.js](#nextjs-mdx-blog) | marker | composted | abandoned | needs you |
| [CV Website](#cv-website) | marker | shipped | shipped | needs you |
| [Trapper Keeper V1](#trapper-keeper-v1) | headstone | shipped | shipped | data |
| [DevConnector 2.0](#devconnector) | headstone | shipped | shipped | needs you |
| [Frontend Final Project](#frontend-final-project) | coursework | shipped | shipped | needs you |
| [Backend Final Project](#backend-final-project) | coursework | shipped | shipped | data |
| [Native Treats API](#native-treats-api) | marker | shipped | shipped | needs you |
| [JP Morgan Forage Program](#jpmc-forage) | marker | shipped | shipped | needs you |
| [CS50P Final Project](#cs50p-final) | headstone | shipped | shipped | data |
| [100 Days of Code Log](#100-days-of-code) | coursework | shipped | shipped | needs you |
| [FreeCodeCamp Fork](#freecodecamp-fork) | marker | composted | abandoned | needs you |
| [Redux Reducer Bootcamp Exercise](#redux-reducer-exercise) | marker | shipped | shipped | needs you |
| [Folkmusic Contribution](#folkmusic-contribution) | marker | shipped | shipped | data |
| [GitHub Actions for CI](#github-actions-ci) | marker | shipped | shipped | git |
| [Connect Tech 2021 Conference App](#connect-tech-2021) | marker | shipped | shipped | git |
| [TDD Big Picture](#tdd-big-picture) | marker | shipped | shipped | needs you |
| [.NET Tools Exploration](#dotnet-tools) | marker | composted | abandoned | needs you |
| [Yup Nosey](#yup-nosey) | marker | composted | abandoned | needs you |
| [Gulp Jest Plugin](#gulp-jest) | marker | composted | outgrew-stack | data |
| [GitHub Profile README](#github-profile) | marker | sprout | — | git |

---

<a id="portfolio-v3"></a>

## Portfolio V3 (`portfolio-v3`)

> Latest version of my portfolio showcasing projects and skills

- **Data:** born `2025-08-01` · died — (open) · tier `marker` · stage `sprout`
- **Git:** first `2024-02-08` · last `2026-11-05` · 874 commits
- **Links:** [repo](https://github.com/Nerajno/portfolio_v3) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `sprout` (keep) | |
| born / died | `2024-02-08` / open (git) | |
| causeOfDeath | — (open project) | |
| outcome | An Astro portfolio with a filterable project showcase, an MDX blog and dark mode. | |
| impact | Moved my public work onto Astro and made performance a habit, not an afterthought. | |
| epitaph | "Still the front door. Still being repainted." | |
| skill tags | Astro, TypeScript, Tailwind CSS, Performance | |

<a id="learnt-project"></a>

## Learnt Project (`learnt-project`)

> Archive and documentation of all my learning projects

- **Data:** born `2025-08-01` · died — (open) · tier `marker` · stage `sprout`
- **Git:** first `2025-08-23` · last `2026-11-09` · 151 commits
- **Links:** [repo](https://github.com/Nerajno/learnt-project) · [live](https://learnt.developingdvlpr.com)

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `sprout` (keep) | |
| born / died | `2025-08-23` / open (git) | |
| causeOfDeath | — (open project) | |
| outcome | This archive: every project I built, learned from or let go, with filters, a timeline and retrospectives. | |
| impact | Taught me as much about reflection as about web development. | |
| epitaph | "Third time is the charm." | |
| skill tags | Astro, TypeScript, Information Architecture, Accessibility | |

<a id="digital-garden"></a>

## Digital Garden (`digital-garden`)

> A growing collection of notes, thoughts, and learning resources

- **Data:** born `2025-09-01` · died — (open) · tier `marker` · stage `sprout`
- **Git:** first `2024-03-11` · last `2026-10-23` · 77 commits
- **Links:** [repo](https://github.com/Nerajno/digital_garden) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `sprout` (keep) | |
| born / died | `2024-03-11` / open (git) | |
| causeOfDeath | — (open project) | |
| outcome | A public notes site with backlinks, tags and evergreen pages. | |
| impact | Made learning in public a habit; notes now link to the projects that taught them. | |
| epitaph | "Never finished. That is the point." | |
| skill tags | HTML, CSS, JavaScript, Content Strategy | |

<a id="is-nerando-done-yet"></a>

## Is Nerando Done Yet (`is-nerando-done-yet`)

> Fun status tracker for monitoring project completion

- **Data:** born `2025-09-20` · died — (open) · tier `marker` · stage `sprout`
- **Git:** first `2022-04-02` · last `2026-10-14` · 90 commits
- **Links:** [repo](https://github.com/Nerajno/isnerandodoneyet-com) · no live URL
- **Note:** git first commit predates the data born date because the repo is a fork; data born kept, confirm.

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `sprout` (keep) | |
| born / died | `2025-09-20` / open (data) | |
| causeOfDeath | — (open project) | |
| outcome | A forked status page that answers one question about my current project. | |
| impact | Practised working inside someone else's Vue codebase without breaking it. | |
| epitaph | "Not yet." | |
| skill tags | Vue, JavaScript, Open Source | |

<a id="digital-mausoleum"></a>

## My Digital Mausoleum (`digital-mausoleum`)

> Collection of archived learning projects and experiments

- **Data:** born `2024-11-01` · died — (open) · tier `marker` · stage `sprout`
- **Git:** first `2025-05-07` · last `2025-05-07` · 1 commits
- **Links:** [repo](https://github.com/NerajnoLearning/My-digital-Mausoleum) · no live URL
- **Note:** one commit only; data born kept, confirm.

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `sprout` (keep) | |
| born / died | `2024-11-01` / open (data) | |
| causeOfDeath | — (open project) | |
| outcome | A repository of archived experiments with learning logs and reflection notes. | |
| impact | The first attempt at honouring finished work instead of hiding it; the idea grew into this archive. | |
| epitaph | "Every project, successful or not, teaches something." | |
| skill tags | Documentation, Git, Markdown | |

<a id="learnt-v2"></a>

## Learnt V2 (`learnt-v2`)

> Second iteration of the Learnt project archive

- **Data:** born `2025-08-10` · died `2025-08-20` · tier `marker` · stage `composted`
- **Git:** first `2025-08-20` · last `2025-08-20` · 1 commits
- **Links:** [repo](https://github.com/Nerajno/learnt_2) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | `2025-08-10` / `2025-08-20` (data) | |
| causeOfDeath | `superseded` | |
| supersededBy | `learnt-project` | |
| outcome | A basic Astro archive with project listing, simple filtering and Markdown content. | |
| impact | Showed me what the archive really needed; its lessons shaped the version you are reading. | |
| epitaph | "Failed forward." | |
| skill tags | Astro, JavaScript, Scope Management | |

<a id="learnt-v1"></a>

## Learnt V1 (`learnt-v1`)

> Initial attempt at creating a project documentation system

- **Data:** born `2025-08-05` · died `2025-08-16` · tier `marker` · stage `composted`
- **Git:** first `2025-08-13` · last `2025-08-15` · 2 commits
- **Links:** [repo](https://github.com/Nerajno/learnt) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | `2025-08-13` / `2025-08-15` (git) | |
| causeOfDeath | `superseded` | |
| supersededBy | `learnt-v2` | |
| outcome | Basic project pages on a first Astro setup. | |
| impact | Proved the idea was worth a second try, and that planning matters before building. | |
| epitaph | "Messy, but it started." | |
| skill tags | Astro, JavaScript, Project Planning | |

<a id="side-project-status"></a>

## Side Project Status Tracker (`side-project-status`)

> Tool for tracking status of multiple side projects

- **Data:** born `2025-04-15` · died `2025-06-01` · tier `marker` · stage `composted`
- **Git:** first `2025-05-04` · last `2025-05-04` · 1 commits
- **Links:** [repo](https://github.com/Nerajno/v0-Side_project_Status) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | `2025-04-15` / `2025-06-01` (data) | |
| causeOfDeath | `superseded` | |
| supersededBy | `learnt-project` | |
| outcome | A Vue dashboard tracking side projects as active, on hold or done, with filters and export. | |
| impact | Its job moved to Learnt, which documents projects instead of only tracking them. | |
| epitaph | "Great tool while it lasted." | |
| skill tags | Vue, State Management, Dashboard UI | |

<a id="burble-v1"></a>

## Burble V1 (`burble-v1`)

> Netflix-inspired streaming interface built with React

- **Data:** born `2024-09-15` · died `2024-11-15` · tier `headstone` · stage `composted`
- **Git:** first `2021-02-20` · last `2025-12-10` · 278 commits
- **Links:** [repo](https://github.com/Nerajno/Burble-V1) · no live URL
- **Note:** git spans years of later commits; confirm cause (abandoned vs outgrew-stack).

| Field | Draft | Your answer |
|---|---|---|
| tier | `headstone` (keep) | |
| stage | `composted` (keep) | |
| born / died | `2024-09-15` / `2024-11-15` (data) | |
| causeOfDeath | `abandoned` | |
| outcome | A streaming-style React interface with category carousels, hover previews, search and a video player. | |
| impact | Taught me that a UI that looks simple can hide hard carousel, timing and layout problems. | |
| epitaph | "Deceptively complex." | |
| skill tags | React, REST APIs, Responsive UI | |

<a id="fcc-calculator"></a>

## FreeCodeCamp Calculator (`fcc-calculator`)

> Calculator built for FreeCodeCamp certification

- **Data:** born `2024-10-01` · died `2024-10-29` · tier `coursework` · stage `shipped`
- **Git:** first `2024-01-07` · last `2024-10-29` · 26 commits
- **Links:** [repo](https://github.com/Nerajno/Ber-kna-FCCFEDL) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2024-10-01` / `2024-10-29` (data) | |
| causeOfDeath | `shipped` | |
| epitaph | "Order of operations, respected." | |
| skill tags | TypeScript, State Machines, Accessibility | |

<a id="trumma-drum-machine"></a>

## Drum Machine - Trumma (`trumma-drum-machine`)

> Browser-based drum machine with keyboard and click support

- **Data:** born `2024-08-15` · died `2024-09-01` · tier `marker` · stage `shipped`
- **Git:** first `2023-07-11` · last `2024-01-07` · 19 commits
- **Links:** [repo](https://github.com/NerajnoLearning/Trumma) · [live](https://drum-machine.freecodecamp.rocks/)
- **Note:** git last commit precedes the data dates; confirm.

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2024-08-15` / `2024-09-01` (data) | |
| causeOfDeath | `shipped` | |
| outcome | A browser drum machine with keyboard and click pads, volume control and visual feedback, live online. | |
| impact | My first real work with the Web Audio API and keyboard event handling. | |
| epitaph | "Still keeps the beat." | |
| skill tags | React, Web Audio API, JavaScript | |

<a id="javascript30"></a>

## JavaScript30 (`javascript30`)

> Completed Wes Bos's 30 day vanilla JavaScript challenge

- **Data:** born `2024-03-01` · died `2024-03-30` · tier `coursework` · stage `shipped`
- **Git:** first `2020-01-01` · last `2021-07-26` · 49 commits
- **Links:** [repo](https://github.com/Nerajno/JavaScript30) · no live URL
- **Note:** git dates are years earlier than data; likely real, confirm.

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2020-01-01` / `2021-07-26` (git) | |
| causeOfDeath | `shipped` | |
| epitaph | "Thirty days, no frameworks." | |
| skill tags | JavaScript, DOM, CSS | |

<a id="vue-conf-workshop"></a>

## Vue Conference Workshop (`vue-conf-workshop`)

> Workshop materials from Vue Conference 2025 on proven patterns

- **Data:** born `2025-05-19` · died `2025-05-19` · tier `marker` · stage `shipped`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/Nerajno/vue-conf-25-proven-patterns-workshop) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| outcome | Worked through a proven-patterns workshop at Vue Conference: Composition API, TypeScript and component architecture. | |
| impact | Gave me patterns for Vue components I still reach for. | |
| epitaph | "Patterns, proven." | |
| skill tags | Vue, TypeScript, Composition API | |

<a id="fcc-d3-bars"></a>

## FCC D3 Bar Chart (`fcc-d3-bars`)

> Bar chart data visualization built with D3.js

- **Data:** born `2024-05-20` · died `2024-06-01` · tier `coursework` · stage `shipped`
- **Git:** first `2025-07-13` · last `2025-07-13` · 4 commits
- **Links:** [repo](https://github.com/NerajnoLearning/FCC_D3_Bars) · no live URL
- **Note:** git shows a later re-upload; data kept.

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2024-05-20` / `2024-06-01` (data) | |
| causeOfDeath | `shipped` | |
| epitaph | "Data, joined." | |
| skill tags | D3.js, Data Visualization, SVG | |

<a id="fcc-d3-story"></a>

## FCC D3 Story (`fcc-d3-story`)

> Final comprehensive D3.js visualization project

- **Data:** born `2024-06-05` · died `2024-06-15` · tier `headstone` · stage `shipped`
- **Git:** first `2025-08-29` · last `2025-08-30` · 7 commits
- **Links:** [repo](https://github.com/NerajnoLearning/FCC_D3_story) · no live URL
- **Note:** git shows a later re-upload; data kept.

| Field | Draft | Your answer |
|---|---|---|
| tier | `headstone` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2024-06-05` / `2024-06-15` (data) | |
| causeOfDeath | `shipped` | |
| outcome | An interactive data story with several coordinated D3 charts, the capstone of the freeCodeCamp Data Visualization track. | |
| impact | Showed me visualization is storytelling as much as code. | |
| epitaph | "Technical skill, told as a story." | |
| skill tags | D3.js, Data Visualization, SVG, JavaScript | |

<a id="vue-holiday-card"></a>

## Vue Holiday Card Maker (`vue-holiday-card`)

> Create and customize holiday cards with Vue.js

- **Data:** born `2024-11-15` · died `2024-12-01` · tier `marker` · stage `shipped`
- **Git:** first `2025-08-04` · last `2026-03-25` · 93 commits
- **Links:** [repo](https://github.com/NerajnoLearning/Vue_Holiday_Card_Maker) · no live URL
- **Note:** git dates are later than the data dates; pick one.

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| outcome | A Vue card maker with templates, custom text, colours and images, and export to an image. | |
| impact | First real work with canvas rendering and file handling in the browser. | |
| epitaph | "Seasonal, but it shipped." | |
| skill tags | Vue, Canvas API, File Handling | |

<a id="assaggio-fcc"></a>

## Assaggio FCC Project (`assaggio-fcc`)

> First project in FreeCodeCamp's Front End Development Libraries path

- **Data:** born `2023-09-01` · died `2023-09-16` · tier `coursework` · stage `shipped`
- **Git:** first `2023-01-12` · last `2023-09-16` · 31 commits
- **Links:** [repo](https://github.com/Nerajno/Assaggio-1-FCC_FEDLC) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2023-01-12` / `2023-09-16` (git) | |
| causeOfDeath | `shipped` | |
| epitaph | "The first taste." | |
| skill tags | JavaScript, Responsive Design, HTML | |

<a id="bravur-fcc"></a>

## bRavur FCC Project (`bravur-fcc`)

> Fourth project in FreeCodeCamp's Front End certification

- **Data:** born `2024-04-15` · died `2024-05-01` · tier `coursework` · stage `shipped`
- **Git:** first `2025-03-01` · last `2025-04-12` · 7 commits
- **Links:** [repo](https://github.com/NerajnoLearning/bRavur-4-FCC_FEDLC) · no live URL
- **Note:** git shows a later re-upload; data kept.

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2024-04-15` / `2024-05-01` (data) | |
| causeOfDeath | `shipped` | |
| epitaph | "State, managed." | |
| skill tags | React, State Management, JavaScript | |

<a id="toppur-fcc"></a>

## Toppur FCC Project (`toppur-fcc`)

> Fifth and final FCC Front End Libraries certification project

- **Data:** born `2024-05-15` · died `2024-06-01` · tier `coursework` · stage `shipped`
- **Git:** first `2025-06-21` · last `2025-06-21` · 1 commits
- **Links:** [repo](https://github.com/NerajnoLearning/NerajnoLearning-sToppur-5-FCC_FEDLC) · no live URL
- **Note:** git shows a later re-upload; data kept.

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2024-05-15` / `2024-06-01` (data) | |
| causeOfDeath | `shipped` | |
| epitaph | "Certified, finally." | |
| skill tags | React, JavaScript, Responsive Design | |

<a id="portfolio-2023"></a>

## Current Portfolio 2023 (`portfolio-2023`)

> Previous iteration of personal portfolio

- **Data:** born `2024-02-01` · died `2024-08-01` · tier `marker` · stage `composted`
- **Git:** first `2022-10-22` · last `2024-03-15` · 82 commits
- **Links:** [repo](https://github.com/Nerajno/Current_Portfolio_2023) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | `2022-10-22` / `2024-03-15` (git) | |
| causeOfDeath | `superseded` | |
| supersededBy | `portfolio-v3` | |
| outcome | A hand-built HTML, CSS and JavaScript portfolio with a project showcase and contact form. | |
| impact | Served as my professional presence until it needed more than vanilla could give. | |
| epitaph | "Served me well." | |
| skill tags | HTML, CSS, JavaScript, Responsive Design | |

<a id="hosted-blog-v3"></a>

## Hosted Blog V3 (`hosted-blog-v3`)

> Third version of my personal blog built with Vue

- **Data:** born `2023-12-01` · died `2024-06-01` · tier `marker` · stage `composted`
- **Git:** first `2023-11-01` · last `2023-12-31` · 34 commits
- **Links:** [repo](https://github.com/Nerajno/hosted_Blog_v3) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | `2023-11-01` / `2023-12-31` (git) | |
| causeOfDeath | `outgrew-stack` | |
| outcome | A Vue and TypeScript blog with Markdown posts, tags, search and an RSS feed. | |
| impact | Taught me blog architecture; the next blog moved to a static site generator. | |
| epitaph | "Third rebuild, same lesson." | |
| skill tags | Vue, TypeScript, Markdown | |

<a id="astro-blog"></a>

## Astro Blog (`astro-blog`)

> Experimental blog built with Astro SSG

- **Data:** born `2024-01-15` · died `2024-03-01` · tier `marker` · stage `composted`
- **Git:** first `2024-01-27` · last `2024-01-27` · 1 commits
- **Links:** [repo](https://github.com/Nerajno/blog-Astro) · no live URL
- **Note:** confirm cause; it led to adopting Astro elsewhere, so merged-into may fit better.

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | `2024-01-15` / `2024-03-01` (data) | |
| causeOfDeath | `abandoned` | |
| outcome | A static Astro blog with Markdown posts, an RSS feed and zero JavaScript by default. | |
| impact | The experiment that made Astro my default for content sites. | |
| epitaph | "The spark, not the fire." | |
| skill tags | Astro, Static Site Generation, Markdown | |

<a id="nextjs-mdx-blog"></a>

## MDX Blog with Next.js (`nextjs-mdx-blog`)

> Modern blog built with Next.js, TypeScript, and MDX

- **Data:** born `2024-01-15` · died `2024-04-01` · tier `marker` · stage `composted`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/Nerajno/My-Self-hosted-TypeScript-Mdx-blog) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `abandoned` | |
| outcome | A forked Next.js blog with MDX posts, TypeScript, Tailwind CSS and dark mode. | |
| impact | A tour of the Next.js and MDX ecosystem that showed me how much configuration it carries. | |
| epitaph | "Explored, then left." | |
| skill tags | Next.js, React, TypeScript, MDX | |

<a id="cv-website"></a>

## CV Website (`cv-website`)

> Minimalist CV webpage optimized for printing

- **Data:** born `2023-12-20` · died `2023-12-27` · tier `marker` · stage `shipped`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/Nerajno/cv) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| outcome | A forked one-page CV, tuned for print and PDF export. | |
| impact | Taught me print CSS and page-break control. | |
| epitaph | "Fits on one page." | |
| skill tags | TypeScript, Print CSS, HTML | |

<a id="trapper-keeper-v1"></a>

## Trapper Keeper V1 (`trapper-keeper-v1`)

> Contact management system built with Ruby on Rails

- **Data:** born `2025-07-01` · died `2025-08-11` · tier `headstone` · stage `shipped`
- **Git:** first `2021-01-26` · last `2025-08-11` · 82 commits
- **Links:** [repo](https://github.com/Nerajno/Trapper_Keeper-v1) · no live URL
- **Note:** git spans years; data kept, confirm.

| Field | Draft | Your answer |
|---|---|---|
| tier | `headstone` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2025-07-01` / `2025-08-11` (data) | |
| causeOfDeath | `shipped` | |
| outcome | A Rails-backed single-page address book with full CRUD, search, categories and a REST API. | |
| impact | My grounding in Rails, REST API design and keeping SPA state in sync with a server. | |
| epitaph | "Every contact, kept." | |
| skill tags | Ruby on Rails, REST APIs, PostgreSQL, JavaScript | |

<a id="devconnector"></a>

## DevConnector 2.0 (`devconnector`)

> Social networking platform for developers built with MERN stack

- **Data:** born `2023-05-01` · died `2023-06-08` · tier `headstone` · stage `shipped`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/NerajnoLearning/devconnector_2.0) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `headstone` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| outcome | A MERN social network for developers: JWT auth, profiles, posts, comments, likes and GitHub repos. | |
| impact | Tied every layer of full-stack development together in one app. | |
| epitaph | "Connected, end to end." | |
| skill tags | React, Node.js, MongoDB, Redux | |

<a id="frontend-final-project"></a>

## Frontend Final Project (`frontend-final-project`)

> Final project for Flatiron School front-end program

- **Data:** born `2023-02-15` · died `2023-03-15` · tier `coursework` · stage `shipped`
- **Git:** first `2019-09-05` · last `2022-10-15` · 37 commits
- **Links:** [repo](https://github.com/Nerajno/frontend_final_project) · no live URL
- **Note:** git range spans years; pick the real build window.

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| epitaph | "Presented, under pressure." | |
| skill tags | React, REST APIs, JavaScript | |

<a id="backend-final-project"></a>

## Backend Final Project (`backend-final-project`)

> Final backend project for bootcamp completion

- **Data:** born `2023-10-01` · died `2023-10-24` · tier `coursework` · stage `shipped`
- **Git:** first `2019-08-29` · last `2023-10-24` · 32 commits
- **Links:** [repo](https://github.com/Nerajno/backend_final-project) · no live URL
- **Note:** git range spans years; data kept, confirm.

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2023-10-01` / `2023-10-24` (data) | |
| causeOfDeath | `shipped` | |
| epitaph | "The API held." | |
| skill tags | Ruby on Rails, PostgreSQL, REST APIs | |

<a id="native-treats-api"></a>

## Native Treats API (`native-treats-api`)

> RESTful API for cataloging regional treats and foods

- **Data:** born `2023-09-01` · died `2023-09-21` · tier `marker` · stage `shipped`
- **Git:** lookup failed
- **Links:** [repo](https://github.com/Nerajno/Native_treats_api) · no live URL
- **Note:** repo lookup failed (renamed or private?).

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| outcome | A REST API cataloguing regional treats, with search, filtering, geographic data and user contributions. | |
| impact | Practised data modelling in MongoDB and designing an API for others to use. | |
| epitaph | "Something sweet, served over REST." | |
| skill tags | Node.js, Express, MongoDB, REST APIs | |

<a id="jpmc-forage"></a>

## JP Morgan Forage Program (`jpmc-forage`)

> Completed JP Morgan Chase Software Engineering virtual experience

- **Data:** born `2023-07-01` · died `2023-07-10` · tier `marker` · stage `shipped`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/Nerajno/forage-jpmc-swe-task-2) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| outcome | Completed the JP Morgan Chase software engineering virtual experience: live stock feeds and real-time charts. | |
| impact | A first look at enterprise codebases and financial data. | |
| epitaph | "Real-world tasks, virtual desk." | |
| skill tags | Python, React, TypeScript, Data Visualization | |

<a id="cs50p-final"></a>

## CS50P Final Project (`cs50p-final`)

> Capstone project for Harvard CS50's Introduction to Programming with Python

- **Data:** born `2024-07-01` · died `2024-08-02` · tier `headstone` · stage `shipped`
- **Git:** first `2025-01-05` · last `2025-01-05` · 2 commits
- **Links:** [repo](https://github.com/NerajnoLearning/CS50P-Final_Project) · no live URL
- **Note:** git shows a later upload; data kept.

| Field | Draft | Your answer |
|---|---|---|
| tier | `headstone` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2024-07-01` / `2024-08-02` (data) | |
| causeOfDeath | `shipped` | |
| outcome | A tested Python command-line tool, submitted as the CS50P final project. | |
| impact | CS50 taught me to think like a programmer and to test before claiming done. | |
| epitaph | "Built from scratch." | |
| skill tags | Python, pytest, CLI | |

<a id="100-days-of-code"></a>

## 100 Days of Code Log (`100-days-of-code`)

> Documentation of my 100 Days of Code challenge journey

- **Data:** born `2024-05-01` · died `2024-08-02` · tier `coursework` · stage `shipped`
- **Git:** first `2020-04-11` · last `2024-07-08` · 404 commits
- **Links:** [repo](https://github.com/Nerajno/100DaysOfCodeLog) · no live URL
- **Note:** git spans years of logs; pick the challenge window.

| Field | Draft | Your answer |
|---|---|---|
| tier | `coursework` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| epitaph | "Consistency beats intensity." | |
| skill tags | Git, Markdown, Consistency | |

<a id="freecodecamp-fork"></a>

## FreeCodeCamp Fork (`freecodecamp-fork`)

> Forked FreeCodeCamp repo for learning and potential contributions

- **Data:** born `2023-12-01` · died `2024-01-01` · tier `marker` · stage `composted`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/Nerajno/freeCodeCamp) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `abandoned` | |
| outcome | A fork of the freeCodeCamp platform, set up locally to study and find first issues. | |
| impact | Taught me how to navigate a very large open-source codebase. | |
| epitaph | "Studied, never merged." | |
| skill tags | Open Source, React, Node.js | |

<a id="redux-reducer-exercise"></a>

## Redux Reducer Bootcamp Exercise (`redux-reducer-exercise`)

> Bootcamp exercise focusing on Redux reducers and state

- **Data:** born `2023-04-10` · died `2023-04-12` · tier `marker` · stage `shipped`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/Nerajno/redux-reducer-atlanta-web-060319) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| outcome | Bootcamp exercise: Redux reducers, action creators and reducer tests. | |
| impact | Made immutability and predictable state click. | |
| epitaph | "Same input, same state." | |
| skill tags | Redux, React, JavaScript, Testing | |

<a id="folkmusic-contribution"></a>

## Folkmusic Contribution (`folkmusic-contribution`)

> Contributed improvements to isolated parts of folkmusic.com

- **Data:** born `2023-06-01` · died `2023-06-08` · tier `marker` · stage `shipped`
- **Git:** first `2019-12-15` · last `2021-07-11` · 10 commits
- **Links:** [repo](https://github.com/Nerajno/folkmusic) · no live URL
- **Note:** git dates are earlier than data; confirm.

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2023-06-01` / `2023-06-08` (data) | |
| causeOfDeath | `shipped` | |
| outcome | CSS, responsive and documentation fixes contributed to folkmusic.com. | |
| impact | My first significant open-source contribution, through real review. | |
| epitaph | "Small fixes, merged." | |
| skill tags | CSS, Open Source, HTML | |

<a id="github-actions-ci"></a>

## GitHub Actions for CI (`github-actions-ci`)

> Project for learning GitHub Actions and CI/CD practices

- **Data:** born `2023-03-15` · died `2023-04-01` · tier `marker` · stage `shipped`
- **Git:** first `2021-11-03` · last `2022-11-14` · 25 commits
- **Links:** [repo](https://github.com/Nerajno/github-actions-for-ci) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2021-11-03` / `2022-11-14` (git) | |
| causeOfDeath | `shipped` | |
| outcome | GitHub Actions workflows for tests, lint, builds and deployment, with matrix builds. | |
| impact | Made CI a default; every project since has a pipeline. | |
| epitaph | "Green checks, automated." | |
| skill tags | GitHub Actions, CI/CD, YAML | |

<a id="connect-tech-2021"></a>

## Connect Tech 2021 Conference App (`connect-tech-2021`)

> Workshop app from Connect Tech 2021 conference

- **Data:** born `2023-03-25` · died `2023-04-01` · tier `marker` · stage `shipped`
- **Git:** first `2021-11-08` · last `2021-11-09` · 9 commits
- **Links:** [repo](https://github.com/NerajnoLearning/conf-app-connecttech-2021) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | `2021-11-08` / `2021-11-09` (git) | |
| causeOfDeath | `shipped` | |
| outcome | A conference schedule app built live in a Connect Tech workshop with React and TypeScript. | |
| impact | Hands-on TypeScript in React from people who use it daily. | |
| epitaph | "Kept up with the code-along." | |
| skill tags | React, TypeScript | |

<a id="tdd-big-picture"></a>

## TDD Big Picture (`tdd-big-picture`)

> Pluralsight course on Test-Driven Development fundamentals

- **Data:** born `2023-01-15` · died `2023-02-01` · tier `marker` · stage `shipped`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/NerajnoLearning/TDD-TheBigPicture) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `shipped` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `shipped` | |
| outcome | Completed the Pluralsight course on test-driven development, with exercises in C#. | |
| impact | Red, green, refactor became how I write tests. | |
| epitaph | "Test first." | |
| skill tags | TDD, C#, Unit Testing | |

<a id="dotnet-tools"></a>

## .NET Tools Exploration (`dotnet-tools`)

> Forked repo exploring various .NET command line tools

- **Data:** born `2022-12-15` · died `2023-01-01` · tier `marker` · stage `composted`
- **Git:** no commits by Nerajno (fork)
- **Links:** [repo](https://github.com/NerajnoLearning/DotNetTools) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `abandoned` | |
| outcome | A fork exploring the .NET command-line tools collection. | |
| impact | A first map of the .NET ecosystem and its CLI. | |
| epitaph | "Explored, not adopted." | |
| skill tags | .NET, C#, CLI | |

<a id="yup-nosey"></a>

## Yup Nosey (`yup-nosey`)

> Curiosity-driven experimental project

- **Data:** born `2025-02-15` · died `2025-03-15` · tier `marker` · stage `composted`
- **Git:** first `2025-11-01` · last `2025-11-01` · 1 commits
- **Links:** [repo](https://github.com/Nerajno/yup-nosey) · no live URL
- **Note:** git date is later than the data dates; pick one.

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | _needs you_ | |
| causeOfDeath | `abandoned` | |
| outcome | A curiosity-driven prototype with no fixed goal. | |
| impact | Taught me to embrace experiments and to know when to stop. | |
| epitaph | "Just being nosey." | |
| skill tags | JavaScript, Prototyping | |

<a id="gulp-jest"></a>

## Gulp Jest Plugin (`gulp-jest`)

> Gulp plugin integration for Jest testing framework

- **Data:** born `2022-07-15` · died `2022-08-01` · tier `marker` · stage `composted`
- **Git:** first `2021-05-06` · last `2026-10-04` · 22 commits
- **Links:** [repo](https://github.com/Nerajno/gulp-jest) · no live URL
- **Note:** git spans years; data kept, confirm.

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `composted` (keep) | |
| born / died | `2022-07-15` / `2022-08-01` (data) | |
| causeOfDeath | `outgrew-stack` | |
| outcome | A Gulp plugin that ran Jest inside a build pipeline, with watch mode. | |
| impact | Taught me streams and plugin design; the tooling world moved past Gulp. | |
| epitaph | "Outrun by the tooling." | |
| skill tags | Node.js, Jest, Build Tools | |

<a id="github-profile"></a>

## GitHub Profile README (`github-profile`)

> Custom GitHub profile README with stats and links

- **Data:** born `2025-03-20` · died — (open) · tier `marker` · stage `sprout`
- **Git:** first `2020-08-01` · last `2026-11-06` · 66 commits
- **Links:** [repo](https://github.com/Nerajno/nerajno) · no live URL

| Field | Draft | Your answer |
|---|---|---|
| tier | `marker` (keep) | |
| stage | `sprout` (keep) | |
| born / died | `2020-08-01` / open (git) | |
| causeOfDeath | — (open project) | |
| outcome | A profile README with stats, a tech stack and links. | |
| impact | The front page of my GitHub; it changes as I do. | |
| epitaph | "Always being updated." | |
| skill tags | Markdown, GitHub, Personal Branding | |
