"""Measure the selected local UI binaries and runtime artifact files, not build trees."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PureWindowsPath


def file_record(path, role, logical_path):
    if not path.is_file():
        raise FileNotFoundError(path)
    with path.open("rb") as stream:
        digest = hashlib.file_digest(stream, "sha256").hexdigest()
    return {"path": logical_path, "role": role, "bytes": path.stat().st_size,
            "sha256": digest}


def artifact_file(root, relative):
    path = PureWindowsPath(relative)
    if path.is_absolute() or path.drive or ".." in path.parts:
        raise ValueError(f"Unsafe artifact path: {relative}")
    resolved = root.joinpath(*path.parts).resolve()
    if not resolved.is_relative_to(root.resolve()):
        raise ValueError(f"Artifact path escapes root: {relative}")
    return resolved


def component(root, label, key):
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    paths = {"manifest.json": "admission_metadata"}
    for field, role in [("module", "compiled_module"), ("metadata", "admission_metadata"),
                        ("kernel_library", "support_library"),
                        ("rocm_runtime_library", "support_library"),
                        ("runtime_library", "support_library")]:
        relative = manifest["files"][field]
        if relative in paths:
            raise ValueError(f"Duplicate artifact role for {relative}")
        paths[relative] = role
    files = [file_record(artifact_file(root, name), role, f"{key}/{name}")
             for name, role in paths.items()]
    return {"label": label, "files": files,
            "module_bytes": sum(f["bytes"] for f in files if f["role"] == "compiled_module")}


def summarize(ui, components):
    files = [ui] + [f for c in components for f in c["files"]]
    totals = {role: sum(f["bytes"] for f in files if f["role"] == role)
              for role in ("ui", "compiled_module", "admission_metadata", "support_library")}
    support = {f["sha256"]: f["bytes"] for f in files if f["role"] == "support_library"}
    return {"ui": ui, "components": components, "totals": totals,
            "ui_and_modules_bytes": totals["ui"] + totals["compiled_module"],
            "support_unique_bytes": sum(support.values()),
            "support_duplicate_bytes": totals["support_library"] - sum(support.values())}


def measure(facet, dinoml):
    qwen = facet / ".work/gui-engine/evidence/m3/artifacts"
    speech = [component(qwen / path, label, key) for path, label, key in [
        ("customvoice_generation_p128_f288_coherent", "Speech generation", "generation"),
        ("tokenizer_decoder_f256_coherent", "Audio decoder", "decoder")]]
    studio = [component(dinoml / ".work/triposplat/artifacts" / stage,
                        f"TripoSplat · {stage.replace('_', ' ')}", f"triposplat/{stage}")
              for stage in ("background_removal", "vision", "image_encoder", "conditioning",
                            "flow", "octree", "gaussians")]
    studio += [component(dinoml / ".work/kimodo-duration/artifacts/kimodo" / stage,
                         f"Kimodo · {stage}", f"kimodo/{stage}")
               for stage in ("text", "root", "body")]
    studio += [component(dinoml / ".work/hundred-seventy-eighth-batch/artifacts/mediapipe_pose_landmarks_heavy",
                         "MediaPipe Pose Landmarker Heavy", "pose")]
    for relative, label in [
        (".work/batch181/artifacts/kimodo/postprocess/dinoml_kimodo_correction.dll", "Kimodo · MotionCorrection"),
        (".work/desktop-buddy/gaussian_build/dinoml_gaussian_deformation.dll", "GPU Gaussian deformation")]:
        record = file_record(dinoml / relative, "compiled_module", Path(relative).name)
        studio.append({"label": label, "files": [record], "module_bytes": record["bytes"]})
    result = {}
    for key, consumer, components in [("custom-voice", "qwen-workbench", speech),
                                      ("motion-and-gaussians", "triposplat-studio", studio)]:
        name = f"facet-{consumer}.exe"
        ui = file_record(facet / "consumers" / consumer / "target/release" / name, "ui", name)
        result[key] = summarize(ui, components)
    return {"schema_version": 1, "measured_at": datetime.now(timezone.utc).isoformat(),
            "basis": "Unpacked logical file bytes; local release executables and selected runtime artifacts. Packages are unavailable.",
            "headline": "UI executable plus compiled modules, including correction and deformation DLLs.",
            "excluded": ["Model weights and constants", "Checkpoint/tokenizer configuration", "ROCm and Visual C++ runtime DLLs", "Demo assets, licences and packaging files", "Debug, compiler-only outputs and static link inputs"],
            "selection": {"custom-voice": "The coherent artifact pair used for the showcase's native speech capture; Qwen defaults now use package-relative paths.",
                          "motion-and-gaussians": "Artifact paths from TripoSplat Studio model.rs and motion.rs defaults."},
            "applications": result}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--facet-root", type=Path, required=True)
    parser.add_argument("--dinoml-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("public/data/sizes.json"))
    args = parser.parse_args()
    data = measure(args.facet_root, args.dinoml_root)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    for key, app in data["applications"].items():
        print(f"{key}: UI {app['totals']['ui']:,} + modules {app['totals']['compiled_module']:,} = {app['ui_and_modules_bytes']:,} bytes")
