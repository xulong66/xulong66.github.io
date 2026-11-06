'use client';

import { useId, useState } from 'react';
import styles from './edge-signal-field.module.css';

const nodes = [
  {
    id: 'sensors',
    label: 'Sensors',
    x: 60,
    y: 42,
    description:
      'Capture signals from the physical world and send measurements to the edge node.',
  },
  {
    id: 'devices',
    label: 'Devices',
    x: 60,
    y: 126,
    description:
      'Generate workloads and offload compute-intensive tasks to nearby edge resources.',
  },
  {
    id: 'edge',
    label: 'Edge AI',
    x: 215,
    y: 85,
    description:
      'Processes incoming data near its source and runs models close to the devices that need them.',
  },
  {
    id: 'inference',
    label: 'Local inference',
    x: 365,
    y: 85,
    description:
      'Turns model outputs into predictions or decisions that can be used locally.',
  },
] as const;

type NodeId = (typeof nodes)[number]['id'];

const routes = [
  { id: 'sensors', path: 'M60 42H115Q128 42 128 55V63Q128 74 139 74H190' },
  { id: 'devices', path: 'M60 126H115Q128 126 128 113V107Q128 96 139 96H190' },
  { id: 'inference', path: 'M240 85H365' },
] as const;

export function EdgeSignalField() {
  const headingId = useId();
  const detailId = useId();
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [focused, setFocused] = useState<NodeId | null>(null);
  const [pinned, setPinned] = useState<NodeId | null>(null);
  const activeId = hovered ?? focused ?? pinned;
  const active = nodes.find((node) => node.id === activeId);
  const activeRoutes = routes.filter(
    (route) => activeId === 'edge' || route.id === activeId,
  );

  return (
    <section className={styles.field} aria-labelledby={headingId}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Explore</span>
        <h2 className={styles.title} id={headingId}>
          Edge AI signal paths
        </h2>
      </div>

      <div className={styles.diagram} data-highlighted={Boolean(active)}>
        <svg viewBox="0 0 440 192" aria-hidden="true" focusable="false">
          <g className={styles.guide}>
            <path d="M18 62V21h81M18 105v46h77m319-89V47h-41m41 57v37h-68" />
            <circle cx="215" cy="85" r="57" />
            <circle cx="215" cy="85" r="42" />
            <path d="M159 142h14m-7-7v14m119-105h14m-7-7v14m35 89h12m-6-6v12" />
          </g>

          {routes.map(({ id, path }) => (
            <path
              className={styles.route}
              data-active={activeId === 'edge' || activeId === id}
              key={id}
              d={path}
            />
          ))}

          <g className={styles.packets} data-idle="true">
            {routes.map(({ id, path }) => (
              <path key={id} d={path} pathLength={100} />
            ))}
          </g>
          {active && (
            <g className={styles.packets} key={active.id}>
              {activeRoutes.map(({ id, path }) => (
                <path key={id} d={path} pathLength={100} />
              ))}
            </g>
          )}

          {nodes
            .filter((node) => node.id !== 'edge')
            .map(({ id, x, y }) => (
              <g key={id}>
                <circle className={styles.terminal} cx={x} cy={y} r="9" />
                <circle className={styles.node} cx={x} cy={y} r="3" />
              </g>
            ))}
          <g className={styles.chip}>
            <rect x="190" y="60" width="50" height="50" rx="12" />
            <rect x="204" y="74" width="22" height="22" rx="5" />
            <path d="M211 69v5m8-5v5m-8 22v5m8-5v5m-20-20h5m-5 8h5m22-8h5m-5 8h5" />
            <rect
              className={styles.core}
              x="211"
              y="81"
              width="8"
              height="8"
              rx="2"
            />
          </g>
        </svg>

        {nodes.map(({ id, label, x, y }) => (
          <button
            key={id}
            className={
              id === 'edge'
                ? `${styles.control} ${styles.hubControl}`
                : styles.control
            }
            type="button"
            style={{ left: `${(x / 440) * 100}%`, top: `${(y / 192) * 100}%` }}
            data-active={activeId === id}
            aria-controls={detailId}
            aria-pressed={pinned === id}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') setHovered(id);
            }}
            onPointerLeave={() => setHovered(null)}
            onFocus={(event) => {
              if (event.currentTarget.matches(':focus-visible')) setFocused(id);
            }}
            onBlur={() => setFocused(null)}
            onClick={() =>
              setPinned((previous) => (previous === id ? null : id))
            }
            onKeyDown={(event) => {
              if (event.key !== 'Escape') return;
              setHovered(null);
              setFocused(null);
              setPinned(null);
            }}
          >
            <span className={styles.nodeLabel}>{label}</span>
          </button>
        ))}
      </div>

      <output className={styles.detail} id={detailId}>
        <strong className={styles.detailTitle}>
          {active?.label ?? 'From data to decisions'}
        </strong>
        <span className={styles.detailCopy}>
          {active?.description ??
            'Hover over or select a node to trace the signal and see what it does.'}
        </span>
      </output>
    </section>
  );
}
