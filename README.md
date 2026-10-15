# DinoML UI showcase

Native Windows interfaces built with DinoML and Facet, with real application
screenshots and measured UI and compiled module sizes.

[View the showcase](https://dinoml.github.io/dinoml-io-showcase/).

The site uses React, TypeScript, Tailwind CSS, and Vite, sharing the visual
foundation of the DinoML performance dashboard.

## Development

Use Node.js >=22.12 (Node 24 LTS recommended).

```powershell
npm ci
npm run dev
```

Development runs at http://127.0.0.1:5174/ so it can run alongside the dashboard.

```powershell
npm run typecheck
npm run format:check
npm run build
npm run preview
```

Production preview runs at http://127.0.0.1:4174/.

## Content

Edit `src/showcases.ts` to maintain the collection. Sizes come from
`public/data/sizes.json`, which includes individual byte counts and SHA-256 hashes.
Original packages were deleted. These measurements use the current local release
executables and selected modules, not a reconstructed ZIP or full installation.

Headline totals are UI executable plus compiled module binaries (including the
Studio correction and deformation DLLs). The public page focuses on screenshots,
UI sizes and module breakdowns. The JSON inventory retains admission metadata,
per-artifact support DLL copies, unique content and duplicate-copy overhead for
reference. Weights, constant tensors, checkpoint/tokenizer files,
ROCm/VC++ runtime DLLs, demo assets, licences and packaging are excluded.
MB is decimal (1,000,000 bytes); hover sizes for exact bytes.

Reproduce the inventory without changing any native files:

```powershell
python tools/measure_sizes.py --facet-root H:/facet --dinoml-root H:/dinoml_v2
python -m unittest discover -s tools -p 'test_*.py'
npm run build
```

The script selects TripoSplat's seven phases, Kimodo's three phases, MediaPipe
Heavy, MotionCorrection and Gaussian deformation from the consumer's configured
paths. Qwen uses the coherent generation/decoder pair selected for its showcase
capture; current Qwen defaults are package-relative and those packages no longer
exist. Compiler graphs/plans, debug trees, link libraries and unused artifact
cohorts are not counted. No local absolute paths are included in the public JSON.

Add real screenshots under `public/screenshots/` and add objects to an entry's
`screenshots` array with `path`, `alt`, and `label` fields. Multiple images get
labelled selection buttons, as used for TripoSplat's Image → 3D and Character motion views.
The initial entries now include actual native application captures; provenance
is recorded in `public/screenshots/README.md`. Entries without images display
an explicitly labelled placeholder. Screenshots open at full resolution when
clicked. Entry fragments
such as `#custom-voice` provide direct links without server-side routing.

## GitHub Pages

`npm run build` produces a static `dist/` directory. Vite's relative base (`./`)
supports a domain root or a repository subdirectory. The workflow in
`.github/workflows/pages.yml` checks and builds each push to `main`, then deploys
the complete `dist/` directory using GitHub Pages. It can also be run manually
from the Actions tab. Measurement data is a committed snapshot; the hosted build
does not access native binaries, models, or local drives.

Dependencies and their locked versions are inherited from the performance
dashboard; dashboard report data, exporters, and generated output are omitted.
