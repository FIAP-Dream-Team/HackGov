"""Keeps the word times of the falas whose audio did not change, after the narration is rebuilt.

Whisper reads the whole narration again on each rebuild, and on 18/11 (four falas re-recorded and one
new) the small model skipped f08 entirely: 52 words became 0, and every reveal of scene 08 would have
been interpolated. A fala cut from the same file at the same points is the same audio, only moved:
its words are taken from the previous transcript, shifted by how far the fala moved. Falas that are new
or re-cut keep the new transcript.

Inputs: the previous transcript.json and falas.json (a copy kept before the rebuild), the new ones.
Output: src/data/gs-pitch/transcript.json, rewritten in place.

Usage:  python -E -P scripts/gs-pitch/reuse-words.py <old transcript.json> <old falas.json>
"""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
NEW_TRANSCRIPT = ROOT / "src" / "data" / "gs-pitch" / "transcript.json"
NEW_FALAS = HERE.parents[2] / "global-solution" / "audio" / "pitch" / "falas.json"


def window(f: dict) -> tuple[float, float]:
    return f["at"] - 0.05, f["at"] + f["length"]


def main() -> None:
    old_words = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))["words"]
    old_falas = {f["id"]: f for f in json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))["falas"]}
    transcript = json.loads(NEW_TRANSCRIPT.read_text(encoding="utf-8"))
    falas = json.loads(NEW_FALAS.read_text(encoding="utf-8"))["falas"]

    words = []
    for f in falas:
        a, b = window(f)
        o = old_falas.get(f["id"])
        same = o is not None and o["source"] == f["source"] and o["cut"] == f["cut"]
        if same:
            oa, ob = window(o)
            shift = f["at"] - o["at"]
            kept = [{**w, "start": round(w["start"] + shift, 3), "end": round(w["end"] + shift, 3)}
                    for w in old_words if oa <= w["start"] < ob]
        else:
            kept = [w for w in transcript["words"] if a <= w["start"] < b]
        heard = len([w for w in transcript["words"] if a <= w["start"] < b])
        print(f"  {f['id']:5} {'anterior' if same else 'nova    '} {len(kept):3} palavras (Whisper agora: {heard})")
        words += kept

    transcript["words"] = words
    transcript["text"] = " ".join(w["text"] for w in words)
    transcript["reusedFrom"] = "previous transcript for falas with the same source and cut (reuse-words.py)"
    NEW_TRANSCRIPT.write_text(json.dumps(transcript, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(words)} palavras -> {NEW_TRANSCRIPT}")


if __name__ == "__main__":
    main()
