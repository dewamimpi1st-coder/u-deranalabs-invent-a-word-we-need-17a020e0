/**
 * Invent a Word We Need — make.fun bounty entry.
 *
 * Coins one new English word, "typelapse", and defines it in a single
 * clear line (max 140 characters), written to /output/entry.txt.
 * "Typelapse" is a blend of type + lapse: the typing dots appear,
 * then lapse, and no message ever arrives.
 *
 * Node 22, standard library only. Deterministic, no network, no input:
 * the entry text is a constant below, guarded by a 1–140 character
 * length gate and verified by reading the file back after writing.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "typelapse (n.) — the small sting when someone's typing dots vanish and no message ever arrives.";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Length gate: the bounty allows exactly one line of 1–140 characters.
const MIN_LENGTH = 1;
const MAX_LENGTH = 140;
if (ENTRY.length < MIN_LENGTH || ENTRY.length > MAX_LENGTH) {
  throw new Error(
    `Entry must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${ENTRY.length}: ${JSON.stringify(ENTRY)}`,
  );
}

// Single-line gate: the entry must be exactly one line and not only
// whitespace, matching the bounty gate (UTF-8 text, 1–140 characters,
// not only white space).
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error(`Entry must be a single line: ${JSON.stringify(ENTRY)}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("Entry must not be only white space");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, ENTRY, "utf8");

const readBack = readFileSync(OUTPUT_FILE, "utf8");
if (readBack !== ENTRY) {
  throw new Error(
    `Read-back mismatch: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(readBack)}`,
  );
}

// Byte-level check: the file must round-trip as exact UTF-8 bytes of the
// entry, so no encoding surprise can slip past the text comparison.
const expectedBytes = Buffer.from(ENTRY, "utf8");
const actualBytes = readFileSync(OUTPUT_FILE);
if (!actualBytes.equals(expectedBytes)) {
  throw new Error(
    `Byte mismatch: expected ${expectedBytes.length} UTF-8 bytes, got ${actualBytes.length}`,
  );
}

console.log(`Wrote ${ENTRY.length} characters to ${OUTPUT_FILE}`);
