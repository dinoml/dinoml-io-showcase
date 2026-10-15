import tempfile
import unittest
from pathlib import Path

from measure_sizes import artifact_file, summarize


class MeasurementTests(unittest.TestCase):
    def test_headline_excludes_metadata_and_support(self):
        files = [{"role": role, "bytes": size, "sha256": digest} for role, size, digest in [
            ("compiled_module", 20, "module"), ("admission_metadata", 100, "metadata"),
            ("support_library", 5, "shared"), ("support_library", 5, "shared")]]
        result = summarize({"role": "ui", "bytes": 10}, [{"files": files}])
        self.assertEqual(result["ui_and_modules_bytes"], 30)
        self.assertEqual(result["totals"]["support_library"], 10)
        self.assertEqual(result["support_unique_bytes"], 5)
        self.assertEqual(result["support_duplicate_bytes"], 5)

    def test_manifest_paths_cannot_escape_artifact(self):
        with tempfile.TemporaryDirectory() as directory:
            for path in ("../elsewhere", "C:/elsewhere", "\\\\server\\share\\file"):
                with self.subTest(path=path), self.assertRaises(ValueError):
                    artifact_file(Path(directory), path)

    def test_relative_artifact_path(self):
        with tempfile.TemporaryDirectory() as directory:
            self.assertEqual(artifact_file(Path(directory), "lib/module.dll"),
                             Path(directory).resolve() / "lib/module.dll")


if __name__ == "__main__":
    unittest.main()
