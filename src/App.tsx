import { useState } from "react";
import { showcases, sizeInventory, type Showcase } from "./showcases";

function bytesLabel(bytes: number) {
  return `${(bytes / 1_000_000).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MB`;
}

function ByteSize({ bytes }: { bytes: number }) {
  return (
    <span title={`${bytes.toLocaleString("en-GB")} bytes`}>
      {bytesLabel(bytes)}
    </span>
  );
}

function SizeBreakdown({ item }: { item: Showcase }) {
  const measured = sizeInventory.applications[item.id];
  return (
    <>
      <div className="package-total">
        <div>
          <span className="size">
            <ByteSize bytes={measured.ui_and_modules_bytes} />
          </span>
          <span className="size-caption">UI + compiled modules · unpacked</span>
        </div>
        <span className="weight-note">Measured file sizes</span>
      </div>
      <dl className="breakdown">
        <div>
          <dt>UI / application executable</dt>
          <dd>
            <ByteSize bytes={measured.totals.ui} />
          </dd>
        </div>
        <div>
          <dt>Compiled modules</dt>
          <dd>
            <ByteSize bytes={measured.totals.compiled_module} />
          </dd>
        </div>
      </dl>
      <details className="module-details">
        <summary>Module breakdown ({measured.components.length})</summary>
        <dl className="breakdown">
          {measured.components.map((component) => (
            <div key={component.label}>
              <dt>{component.label}</dt>
              <dd>
                <ByteSize bytes={component.module_bytes} />
              </dd>
            </div>
          ))}
        </dl>
      </details>
      <p className="size-exclusions">
        Excludes weights, constants, checkpoint files, ROCm / VC++ runtimes, and
        demo assets.
      </p>
    </>
  );
}

function ScreenshotGallery({ item }: { item: Showcase }) {
  const [selected, setSelected] = useState(0);
  const screenshot = item.screenshots[selected];
  if (!screenshot)
    return (
      <div className="screenshot-placeholder">Interface screenshot pending</div>
    );
  return (
    <div className="screenshot-gallery">
      <div
        className="screenshot-choices"
        role="group"
        aria-label={`${item.title} screenshots`}
      >
        {item.screenshots.map((image, index) => (
          <button
            key={image.path}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            {image.label}
          </button>
        ))}
      </div>
      <a
        href={`${import.meta.env.BASE_URL}${screenshot.path}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open full-resolution screenshot: ${screenshot.label}`}
      >
        <img
          className="showcase-image"
          src={`${import.meta.env.BASE_URL}${screenshot.path}`}
          alt={screenshot.alt}
          loading="lazy"
          width="1280"
          height="900"
        />
      </a>
    </div>
  );
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to showcase
      </a>
      <aside className="sidebar" aria-label="Showcase navigation">
        <a className="brand" href="./" aria-label="DinoML showcase home">
          <img
            src={`${import.meta.env.BASE_URL}icon.svg`}
            width="36"
            height="36"
            alt=""
          />
          <span>
            dino<span className="brand-ml">ml</span>
            <small>UI SHOWCASE</small>
          </span>
        </a>
        <nav aria-label="On this page">
          <div className="rail-label">EXPLORE</div>
          <a className="rail-link active" href="#showcases">
            <span className="rail-symbol" aria-hidden="true">
              ◫
            </span>{" "}
            Interfaces <span className="rail-count">{showcases.length}</span>
          </a>
        </nav>
        <p className="rail-note">Interfaces built with DinoML.</p>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="crumb">DinoML</span>
            <span className="separator">/</span>
            <h1 className="page-title">UI showcase</h1>
          </div>
          <span className="platform-label">Native Windows applications</span>
        </header>
        <main id="main">
          <section id="showcases" aria-labelledby="showcases-title">
            <div className="section-heading">
              <div>
                <div className="eyebrow muted">THE COLLECTION</div>
                <h2 id="showcases-title">Application interfaces</h2>
              </div>
              <span className="section-note">
                {showcases.length} applications
              </span>
            </div>
            <div className="showcase-grid">
              {showcases.map((item) => (
                <article
                  key={item.id}
                  id={item.id}
                  className="showcase-card"
                  aria-labelledby={`${item.id}-title`}
                >
                  <ScreenshotGallery item={item} />
                  <div className="showcase-content">
                    <div className="eyebrow">{item.category}</div>
                    <h3 id={`${item.id}-title`}>
                      <a href={`#${item.id}`}>{item.title}</a>
                    </h3>
                    <p className="description">{item.description}</p>
                    <ul className="modules" aria-label="Models and modules">
                      {item.modules.map((module) => (
                        <li key={module}>{module}</li>
                      ))}
                    </ul>
                    <SizeBreakdown item={item} />
                  </div>
                </article>
              ))}
            </div>
          </section>
          <footer>
            DinoML <span>·</span> UI showcase
          </footer>
        </main>
      </div>
    </>
  );
}
