import {
  DEFAULT_FILTERS,
  buildQuery,
  filterProjects,
  parseFilters,
  type ArchiveFilters,
  type ArchiveItem,
  type ArchiveView,
  type Sort,
  type Stage,
} from '../lib/archive';

const list = document.querySelector<HTMLElement>('#project-list');
const form = document.querySelector<HTMLFormElement>('#archive-controls');
const searchInput = document.querySelector<HTMLInputElement>('#archive-search');
const categorySelect = document.querySelector<HTMLSelectElement>('#archive-category');
const yearSelect = document.querySelector<HTMLSelectElement>('#archive-year');
const sortSelect = document.querySelector<HTMLSelectElement>('#archive-sort');
const countEl = document.querySelector<HTMLElement>('#archive-count');
const emptyEl = document.querySelector<HTMLElement>('#archive-empty');
const clearBtn = document.querySelector<HTMLButtonElement>('#archive-clear');
const emptyClearBtn = document.querySelector<HTMLButtonElement>('#archive-empty-clear');
const stageButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-stage-filter]'));
// #21: grid/timeline toggle; timeline rows are hidden by slug like the cards.
const viewButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('#archive-controls [data-view]'));
const timelineEl = document.querySelector<HTMLElement>('#project-timeline');
const timelineRows = timelineEl ? Array.from(timelineEl.querySelectorAll<HTMLElement>('li[data-slug]')) : [];
const timelineYears = timelineEl ? Array.from(timelineEl.querySelectorAll<HTMLElement>('[data-year-group]')) : [];

const cards = list ? Array.from(list.querySelectorAll<HTMLElement>('article[data-slug]')) : [];
const cardsBySlug = new Map(cards.map((card) => [card.dataset.slug ?? '', card]));

function itemFromCard(card: HTMLElement): ArchiveItem {
  const data = card.dataset;
  return {
    slug: data.slug ?? '',
    title: data.title ?? '',
    category: (data.category ?? 'frontend') as ArchiveItem['category'],
    stage: (data.stage ?? 'seed') as Stage,
    year: data.year ? Number(data.year) : null,
    born: data.born ?? '',
    died: data.died ?? '',
    search: data.search ?? '',
  };
}

const items = cards.map(itemFromCard);

function readControls(): ArchiveFilters {
  const pressed = stageButtons.find((button) => button.getAttribute('aria-pressed') === 'true');

  return {
    q: searchInput?.value ?? '',
    stage: (pressed?.dataset.stageFilter ?? '') as Stage | '',
    category: categorySelect?.value ?? '',
    year: yearSelect?.value ? Number(yearSelect.value) : null,
    sort: (sortSelect?.value ?? DEFAULT_FILTERS.sort) as Sort,
    view: (viewButtons.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.view ??
      DEFAULT_FILTERS.view) as ArchiveView,
  };
}

function syncControls(filters: ArchiveFilters) {
  if (searchInput && searchInput.value !== filters.q) searchInput.value = filters.q;
  if (categorySelect) categorySelect.value = filters.category;
  if (yearSelect) yearSelect.value = filters.year === null ? '' : String(filters.year);
  if (sortSelect) {
    sortSelect.value = filters.sort;
    // The timeline is always in year order, so sort doesn't apply there.
    sortSelect.disabled = filters.view === 'timeline';
  }

  for (const button of stageButtons) {
    button.setAttribute('aria-pressed', String((button.dataset.stageFilter ?? '') === filters.stage));
  }
  for (const button of viewButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.view === filters.view));
  }
}

function apply(filters: ArchiveFilters, mode: 'push' | 'replace' | 'none') {
  if (!list) return;

  const ordered = filterProjects(items, filters);
  const visibleSlugs = new Set(ordered.map((item) => item.slug));

  for (const card of cards) {
    card.hidden = !visibleSlugs.has(card.dataset.slug ?? '');
  }
  for (const item of ordered) {
    const card = cardsBySlug.get(item.slug);
    if (card) list.appendChild(card);
  }

  const isTimeline = filters.view === 'timeline';
  list.hidden = isTimeline;
  if (timelineEl) timelineEl.hidden = !isTimeline;
  for (const row of timelineRows) row.hidden = !visibleSlugs.has(row.dataset.slug ?? '');
  for (const group of timelineYears) {
    group.hidden = !Array.from(group.querySelectorAll<HTMLElement>('li[data-slug]')).some((row) => !row.hidden);
  }

  if (countEl) countEl.textContent = String(ordered.length);
  if (emptyEl) emptyEl.hidden = ordered.length !== 0;
  syncControls(filters);

  if (mode !== 'none') {
    const url = `${location.pathname}${buildQuery(filters)}`;
    if (mode === 'push') history.pushState({}, '', url);
    else history.replaceState({}, '', url);
  }
}

apply(parseFilters(location.search), 'none');

if (searchInput) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => apply(readControls(), 'replace'), 150);
  });
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      searchInput.value = '';
      apply(readControls(), 'replace');
    }
  });
}

for (const button of stageButtons) {
  button.addEventListener('click', () => {
    for (const other of stageButtons) {
      other.setAttribute('aria-pressed', String(other === button));
    }
    apply(readControls(), 'push');
  });
}

for (const select of [categorySelect, yearSelect, sortSelect]) {
  select?.addEventListener('change', () => apply(readControls(), 'push'));
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  apply(readControls(), 'replace');
});

// Without JS the toggle can't work, so it only appears once this script runs.
const viewToggle = document.querySelector<HTMLElement>('[data-view-toggle]');
if (viewToggle) viewToggle.hidden = false;

for (const button of viewButtons) {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return; // already showing this view
    for (const other of viewButtons) other.setAttribute('aria-pressed', String(other === button));
    apply(readControls(), 'push');
  });
}

function clearAll() {
  // Clearing filters keeps the chosen view.
  apply({ ...DEFAULT_FILTERS, view: readControls().view }, 'push');
  searchInput?.focus();
}

clearBtn?.addEventListener('click', clearAll);
emptyClearBtn?.addEventListener('click', clearAll);

window.addEventListener('popstate', () => apply(parseFilters(location.search), 'none'));
