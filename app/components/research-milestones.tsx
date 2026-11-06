'use client';

import { ArrowUpRight } from 'lucide-react';
import { useId, useState, useSyncExternalStore } from 'react';
import content from '../data/site-content.json';
import styles from './research-milestones.module.css';

/* oxlint-disable jsx-a11y/no-redundant-roles -- Safari needs an explicit list role when markers are hidden. */

const filters = [
  ['all', 'All'],
  ['publication', 'Publications'],
  ['patent', 'Patents'],
] as const;

type Filter = (typeof filters)[number][0];

type Milestone = {
  id: string;
  category: Exclude<Filter, 'all'>;
  year: number;
  dateTime: string;
  dateLabel: string;
  label: string;
  meta: string;
  title: string;
  people: string;
  source: string;
  kind: string;
  action: string;
  url: string;
  summary?: string;
  applicationNumber?: string;
};

const publicationDisplay: Record<
  string,
  { label: string; meta: string; kind: string }
> = {
  'https://www.future-forum.org.cn/en/fcn2026/About.html': {
    label: 'Satellite–terrestrial offloading',
    meta: 'FCN · Accepted',
    kind: 'Conference · Accepted',
  },
  'https://doi.org/10.1016/j.dcan.2025.09.002': {
    label: 'Multi-agent RL for vehicular offloading',
    meta: 'Digital Communications and Networks',
    kind: 'Journal article',
  },
  'https://doi.org/10.1109/WCNC61545.2025.10978374': {
    label: 'Adaptive computation offloading',
    meta: 'IEEE WCNC · Presented',
    kind: 'Conference · Presented',
  },
  'https://doi.org/10.1016/j.dcan.2024.03.008': {
    label: 'Underwater target detection and tracking',
    meta: 'Digital Communications and Networks',
    kind: 'Journal article',
  },
};

const patentLabels: Record<string, string> = {
  CN121368013B: 'Data transmission system',
  CN119938160A: 'Offloading for multi-mode terminals',
  CN117880887A: 'Service offloading for mobile terminals',
  CN116209103B: 'Mobile terminal communication',
};

const months =
  'January February March April May June July August September October November December'.split(
    ' ',
  );
const publicationUpdates = new Map(
  content.news.map(({ publicationUrl, text }) => [publicationUrl, text]),
);

const publications = content.publications.map((paper): Milestone => {
  const display = publicationDisplay[paper.url];

  return {
    id: paper.url,
    category: 'publication',
    year: paper.year,
    dateTime: String(paper.year),
    dateLabel: String(paper.year),
    label: display?.label ?? paper.title,
    meta: display?.meta ?? paper.venue,
    title: paper.title,
    people: paper.authors,
    source: paper.venue,
    kind: display?.kind ?? paper.kind,
    action: paper.linkLabel ? `${paper.linkLabel} conference` : 'Read via DOI',
    url: paper.url,
    summary: publicationUpdates.get(paper.url),
  };
});

const patents = content.patents.map((patent): Milestone => {
  const [month, day] = patent.date.split(/[ ,]+/);
  const monthNumber = String(months.indexOf(month) + 1).padStart(2, '0');
  const granted = patent.status.startsWith('Granted');

  return {
    id: patent.number,
    category: 'patent',
    year: patent.year,
    dateTime: `${patent.year}-${monthNumber}-${day.padStart(2, '0')}`,
    dateLabel: patent.date,
    label: patentLabels[patent.number] ?? patent.title,
    meta: `${patent.number} · ${granted ? 'Granted' : 'Published'}`,
    title: patent.title,
    people: patent.inventors,
    source: `${patent.number} · ${patent.assignee}`,
    kind: granted ? 'Granted patent' : 'Published patent application',
    action: granted ? 'View patent record' : 'View application record',
    url: patent.url,
    applicationNumber: patent.applicationNumber,
  };
});

const milestones = [...publications, ...patents].sort(
  (first, second) => second.year - first.year,
);

const compactQuery = '(max-width: 620px)';

function subscribeToCompactLayout(onChange: () => void) {
  const query = window.matchMedia?.(compactQuery);
  query?.addEventListener('change', onChange);
  return () => query?.removeEventListener('change', onChange);
}

function getCompactLayout() {
  return window.matchMedia?.(compactQuery).matches ?? false;
}

function getServerCompactLayout() {
  return false;
}

export function ResearchMilestones() {
  const detailId = useId();
  const compact = useSyncExternalStore(
    subscribeToCompactLayout,
    getCompactLayout,
    getServerCompactLayout,
  );
  const [selection, setSelection] = useState<{ filter: Filter; id?: string }>({
    filter: 'all',
  });
  const visible = milestones.filter(
    (item) => selection.filter === 'all' || item.category === selection.filter,
  );
  const selected =
    visible.find((item) => item.id === selection.id) ?? visible[0];
  const years = [...new Set(visible.map((item) => item.year))];

  const detail = selected && (
    <article
      aria-labelledby={`${detailId}-title`}
      className={styles.detail}
      data-category={selected.category}
      id={detailId}
      key={selected.id}
    >
      <p className={styles.kicker}>Selected milestone</p>
      <div className={styles.metadata}>
        <span className={styles.kind}>{selected.kind}</span>
        <time dateTime={selected.dateTime}>{selected.dateLabel}</time>
      </div>
      <h3 id={`${detailId}-title`}>{selected.title}</h3>
      {selected.summary && <p className={styles.summary}>{selected.summary}</p>}
      <p className={styles.people}>{selected.people}</p>
      <p className={styles.source}>{selected.source}</p>
      {selected.applicationNumber && (
        <p className={styles.source}>
          Application No. {selected.applicationNumber}
        </p>
      )}
      <a
        className={styles.sourceLink}
        href={selected.url}
        target="_blank"
        rel="noreferrer"
      >
        {selected.action}
        <ArrowUpRight aria-hidden="true" size={16} />
      </a>
    </article>
  );

  return (
    <div className={styles.milestones}>
      <fieldset className={styles.filterSet}>
        <legend className={styles.visuallyHidden}>Filter milestones</legend>
        <div className={styles.filters}>
          {filters.map(([filter, label]) => (
            <button
              aria-pressed={selection.filter === filter}
              key={filter}
              onClick={() => {
                const keepSelection =
                  filter === 'all' || selected?.category === filter;
                setSelection({
                  filter,
                  id: keepSelection ? selected?.id : undefined,
                });
              }}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <output className={styles.visuallyHidden}>
        {visible.length} milestones. {selected && `${selected.label} selected.`}
      </output>

      <div className={styles.workspace}>
        <ol
          aria-label="Milestones by year"
          className={styles.years}
          role="list"
        >
          {years.map((year) => (
            <li key={year}>
              <time className={styles.year} dateTime={String(year)}>
                {year}
              </time>
              <ol
                aria-label={`${year} milestones`}
                className={styles.events}
                role="list"
              >
                {visible
                  .filter((item) => item.year === year)
                  .map((item) => {
                    const active = selected?.id === item.id;

                    return (
                      <li data-category={item.category} key={item.id}>
                        <button
                          aria-controls={detailId}
                          aria-label={`${item.label}, ${item.meta}`}
                          aria-pressed={active}
                          className={styles.node}
                          onClick={() =>
                            setSelection({ ...selection, id: item.id })
                          }
                          type="button"
                        >
                          <span aria-hidden="true" className={styles.dot} />
                          <span>
                            <span className={styles.nodeTitle}>
                              {item.label}
                            </span>
                            <span className={styles.nodeMeta}>{item.meta}</span>
                          </span>
                        </button>
                        {compact && active && detail}
                      </li>
                    );
                  })}
              </ol>
            </li>
          ))}
        </ol>
        {!compact && detail}
      </div>
    </div>
  );
}
