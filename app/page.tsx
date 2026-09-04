import {
  ArrowUpRight,
  BookOpen,
  Bot,
  Code2 as Github,
  GraduationCap,
  Mail,
  MapPin,
  Network,
  Radio,
} from 'lucide-react';
import content from './data/site-content.json';

const navigation = [
  ['About', '#about'],
  ['Research', '#research'],
  ['News', '#news'],
  ['Publications', '#publications'],
  ['Education', '#education'],
  ['Contact', '#contact'],
] as const;

const profileLinks = [
  { label: 'Email', href: content.links.email, icon: Mail },
  { label: 'Google Scholar', href: content.links.scholar, icon: GraduationCap },
  { label: 'GitHub', href: content.links.github, icon: Github },
];

const researchIcons = {
  network: Network,
  agents: Bot,
  radio: Radio,
} as const;

function SectionHeading({
  index,
  title,
  note,
  id,
}: {
  index: string;
  title: string;
  note: string;
  id: string;
}) {
  return (
    <div className="section-heading">
      <p aria-hidden="true">{index}</p>
      <div>
        <h2 id={id}>{title}</h2>
        <span>{note}</span>
      </div>
    </div>
  );
}

function EmphasizedAuthors({ authors }: { authors: string }) {
  const [before, after = ''] = authors.split('Long Xu');
  return (
    <>
      {before}
      <strong>Long Xu</strong>
      {after}
    </>
  );
}

export default function HomePage() {
  const { profile } = content;

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <header className="site-header">
        <div className="nav-shell">
          <a className="wordmark" href="#about" aria-label="Long Xu home">
            <span className="wordmark-mark" aria-hidden="true">
              LX
            </span>
            <span>{profile.name}</span>
          </a>

          <nav aria-label="Primary navigation">
            {navigation.map(([label, href]) => (
              <a className="nav-link" href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero" id="about" aria-labelledby="profile-name">
          <div className="signal-field" aria-hidden="true">
            <i />
            <i />
            <i />
            <span />
          </div>

          <div className="hero-copy">
            <p className="eyebrow">{profile.descriptor}</p>
            <h1 id="profile-name">
              {profile.name}
              <span lang="zh-Hans">{profile.chineseName}</span>
            </h1>

            <p className="role">{profile.role}</p>
            <div className="affiliation">
              <p>{profile.school}</p>
              <p>{profile.affiliation}</p>
              <p className="location">
                <MapPin aria-hidden="true" size={15} />
                {profile.location}
              </p>
            </div>

            <p className="intro">{profile.bio[0]}</p>

            <div
              className="profile-links"
              aria-label="Academic profiles and contact"
            >
              {profileLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <Icon aria-hidden="true" size={17} />
                  <span>{label}</span>
                  {href.startsWith('http') && (
                    <ArrowUpRight aria-hidden="true" size={14} />
                  )}
                </a>
              ))}
            </div>
          </div>

          <figure className="portrait-wrap">
            <div className="portrait-frame">
              {/* oxlint-disable-next-line next/no-img-element -- Local Scholar portrait uses a deliberate square crop. */}
              <img
                src="/long-xu.jpg"
                alt="Portrait of Long Xu"
                width="360"
                height="360"
              />
            </div>
            <figcaption>
              <span>Researcher</span>
              Edge intelligence for connected systems
            </figcaption>
          </figure>
        </section>

        <section
          className="content-section"
          id="research"
          aria-labelledby="research-heading"
        >
          <SectionHeading
            index="01"
            id="research-heading"
            title="Research"
            note="Systems that learn where computation should happen."
          />
          <div className="research-grid">
            {content.research.map((item) => {
              const Icon =
                researchIcons[item.icon as keyof typeof researchIcons];
              return (
                <article className="research-card" key={item.title}>
                  <span className="icon-tile" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
          <p className="bio-continuation">{profile.bio[1]}</p>
        </section>

        <section
          className="content-section"
          id="news"
          aria-labelledby="news-heading"
        >
          <SectionHeading
            index="02"
            id="news-heading"
            title="News"
            note="Recent research milestones."
          />
          <ol className="news-list">
            {content.news.map((item, index) => (
              <li key={`${item.date}-${index}`}>
                <time>{item.date}</time>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="content-section"
          id="publications"
          aria-labelledby="publications-heading"
        >
          <SectionHeading
            index="03"
            id="publications-heading"
            title="Selected Publications"
            note="Verified journal and conference work."
          />
          <div className="publication-list">
            {content.publications.map((publication) => (
              <article className="publication-card" key={publication.title}>
                <div className="publication-index" aria-hidden="true">
                  <BookOpen size={19} />
                </div>
                <div className="publication-body">
                  <div className="publication-meta">
                    <span>{publication.kind}</span>
                    <time>{publication.year}</time>
                  </div>
                  <h3>{publication.title}</h3>
                  <p className="authors">
                    <EmphasizedAuthors authors={publication.authors} />
                  </p>
                  <p className="venue">{publication.venue}</p>
                </div>
                <a
                  className="paper-link"
                  href={publication.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open paper: ${publication.title}`}
                >
                  DOI <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className="content-section"
          id="education"
          aria-labelledby="education-heading"
        >
          <SectionHeading
            index="04"
            id="education-heading"
            title="Education"
            note="Training in communication engineering and intelligent wireless systems."
          />
          <ol className="timeline">
            {content.education.map((item) => (
              <li key={`${item.period}-${item.degree}`}>
                <span className="timeline-period">{item.period}</span>
                <div>
                  <h3>{item.degree}</h3>
                  <p>{item.school}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="contact-card"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <div className="contact-copy">
            <p className="contact-index" aria-hidden="true">
              05
            </p>
            <h2 id="contact-heading">Contact</h2>
            <h3>Let&apos;s talk about edge intelligence.</h3>
            <p>
              I welcome conversations about computation offloading, multi-agent
              reinforcement learning, and wireless systems.
            </p>
          </div>
          <div className="contact-actions">
            <a className="contact-email" href={content.links.email}>
              <Mail aria-hidden="true" size={18} />
              {profile.email}
            </a>
            <a href={content.links.scholar} target="_blank" rel="noreferrer">
              Google Scholar <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <a href={content.links.github} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" size={16} /> GitHub
            </a>
            <a href={content.links.orcid} target="_blank" rel="noreferrer">
              ORCID <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} Long Xu. Built for clear research
          communication.
        </p>
      </footer>
    </>
  );
}
