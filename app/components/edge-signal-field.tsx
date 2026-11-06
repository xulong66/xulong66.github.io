import styles from './edge-signal-field.module.css';

const routes = [
  'M84 120H128Q140 120 140 132V196Q140 208 152 208H164V217',
  'M277 48V84Q277 96 265 96H221Q209 96 209 108V233H194',
  'M164 277V379Q164 391 176 391H209Q221 391 221 403V463Q221 475 233 475H421',
];

export function EdgeSignalField() {
  return (
    <div className={styles.field} aria-hidden="true">
      <svg viewBox="0 0 568 502" focusable="false">
        <g className={styles.guide}>
          <path d="M46 179V87h171M327 27h170v92M47 323v97h160m127 55h32m114 0h34v-75" />
          <circle cx="376" cy="246" r="198" />
          <circle cx="376" cy="246" r="163" />
          <circle cx="376" cy="246" r="128" />
          <path d="M96 172h16m-8-8v16M358 71h16m-8-8v16m-5 329h12m-6-6v12M505 75h12m-6-6v12" />
        </g>

        <g className={styles.trace}>
          <path d="M195 257h29q12 0 12-12V180q0-12 12-12h34m-164 97H88q-12 0-12 12v69m224 53h104q12 0 12-12v-19" />
          {routes.map((route) => (
            <path key={route} d={route} />
          ))}
        </g>

        <g className={styles.packets}>
          {routes.map((route) => (
            <path key={route} d={route} pathLength={100} />
          ))}
        </g>

        <g className={styles.terminal}>
          <circle cx="84" cy="120" r="9" />
          <circle cx="277" cy="48" r="9" />
          <circle cx="421" cy="475" r="9" />
        </g>
        <g className={styles.node}>
          <circle cx="84" cy="120" r="2.5" />
          <circle cx="277" cy="48" r="2.5" />
          <circle cx="421" cy="475" r="2.5" />
          <circle cx="76" cy="346" r="3" />
          <circle cx="282" cy="168" r="3" />
          <circle cx="416" cy="368" r="3" />
        </g>

        <g className={styles.chip}>
          <rect x="134" y="217" width="60" height="60" rx="14" />
          <rect x="151" y="234" width="26" height="26" rx="5" />
          <path d="M158 228v6m12-6v6m-12 26v6m12-6v6m-25-25h6m-6 12h6m26-12h6m-6 12h6" />
          <rect
            className={styles.core}
            x="160"
            y="243"
            width="8"
            height="8"
            rx="2"
          />
        </g>

        <g className={styles.labels}>
          <text x="84" y="100" textAnchor="middle">
            SENSORS
          </text>
          <text x="299" y="52">
            DEVICES
          </text>
          <text x="421" y="498" textAnchor="middle">
            LOCAL INFERENCE
          </text>
          <text className={styles.hubLabel} x="164" y="300" textAnchor="middle">
            EDGE AI
          </text>
        </g>
      </svg>
    </div>
  );
}
