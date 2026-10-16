# Causal-ARD

Project page for **Causal-ARD: Zero-shot Reward Design for Automated Skill Generation**. The page follows the current `TSMC/TSMC.tex` manuscript: Causal-ARD is the framework, and the reward causal prior supplies reusable structural guidance for reward construction.

## Preview locally

From this directory, run:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>. Use an HTTP server rather than opening `index.html` directly, because PDF figures are loaded by an ES module and a web worker. The site remains a static GitHub Pages project and needs no build step.

## Content and figures

- `index.html` contains the page text. Its abstract and conclusion match the manuscript.
- `static/pdfs/Causal-ARD.pdf` is the manuscript linked by the Paper button.
- The existing six experimental displays retain their original order and videos: CatchAbreast, CatchOver2Underarm, Pen, PickCube, TurnFaucet, and OpenCabinetDrawer.
- Framework and experiment figures are rendered directly from the copied paper PDFs. Clicking a figure opens its source PDF. If inline rendering is unavailable, the PDF link remains accessible.
- The real-world section reports offline trajectory reward alignment, with mean AUC of 53.9% for ZS-LLM and 96.5% for Causal-ARD. It does not present closed-loop sim-to-real policy results.
- Video files and their references are retained unchanged.

The table below records the paper assets used on the page. Paths in the right column are relative to the parent paper repository.

| Page asset under `static/pdfs/figures/` | Paper source |
| --- | --- |
| `method_tsmc.pdf` | `TSMC/sec/method/fig/method_tsmc.pdf` |
| `reward-causal-prior.pdf` | `sublimentary/appendix/discuss_fig/CRWM.pdf` |
| `catch_abreast.pdf` | `TSMC/sec/experiment/fig/catch_abreast.pdf` |
| `catch_over_2underarm.pdf` | `TSMC/sec/experiment/fig/catch_over_2underarm.pdf` |
| `pen.pdf` | `TSMC/sec/experiment/fig/pen.pdf` |
| `pickcube.pdf` | `TSMC/sec/experiment/fig/pickcube.pdf` |
| `TurnFaucet.pdf` | `TSMC/sec/experiment/fig/TurnFaucet.pdf` |
| `OpenCabinetDrawer.pdf` | `TSMC/sec/experiment/fig/OpenCabinetDrawer.pdf` |

When replacing a PDF with a different page size, update its `--figure-ratio` in `index.html` to match the PDF's width and height. PDF.js also reads the intrinsic dimensions when rendering. The renderer is in `static/js/pdf-figures.js`; PDF.js 4.10.38, its worker, standard fonts, and licenses are bundled under `static/js/vendor/pdfjs/`.

The page retains styling based on the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) and [Nerfies](https://nerfies.github.io/).

## License

The website retains its [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license. The bundled PDF.js library has its own Apache 2.0 license and preserves the upstream font licenses.
