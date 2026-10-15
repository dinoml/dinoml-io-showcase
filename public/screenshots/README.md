# Native interface captures

Captured on 15 October 2026 using the consumers' built-in `--capture` support,
at 1280 × 900. Images are unmodified application renders, without OS window chrome.

- `custom-voice.png`: Qwen3-TTS workbench, release executable dated 7 October
  2026. Actual 0.6B CustomVoice generation using the coherent local generation
  and decoder artifacts; completed 209,280 mono PCM frames at 24 kHz (8.72 s).
  This capture used `--auto`, not the synthetic `--fake` mode.
- `motion-and-gaussians.png`: TripoSplat Studio, release executable dated 12
  October 2026. Opened with `--character`, showing the saved rigged demo and
  eight-second clip at frame zero, rendered by the native GPU worker. No new
  TripoSplat, pose estimation or Kimodo generation was performed for this capture.
- `triposplat-image-to-3d.png`: the same TripoSplat Studio release, opened in the
  Image → 3D workspace with an existing generated `pink-third/source.splat` asset.
  The native preview renders the saved Gaussians; no new generation was requested.

Local capture receipts and the generated speech take remain in ignored
`.preview/captures/`. Screenshots illustrate the interfaces; they do not establish
package sizes, performance benchmarks or general model quality.
