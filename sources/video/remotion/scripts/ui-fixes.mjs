// Adjustments applied to the deck markup on the way into the video.
//
// Two jobs, both deliberately kept out of the deck file itself so the PDF stays
// exactly as the group designed it:
//
//   1. Layout fixes for problems that only hurt at video scale.
//   2. `data-reveal` tags, so individual elements can be staged in on the word
//      that mentions them instead of the whole slide landing at once.
//
// Every change is listed here with the reason. If a fix turns out to be worth
// having in the deck too, port it there and delete it from this file.

/** Walks direct-child indexes: childAt($, root, 2, 1) is root's 3rd child's 2nd. */
const childAt = ($, root, ...path) => {
  let node = $(root);
  for (const index of path) {
    node = node.children().eq(index);
    if (!node.length) return null;
  }
  return node;
};

/** Merges declarations into an element's existing inline style. */
const restyle = (node, patch) => {
  if (!node) return;
  let style = node.attr("style") ?? "";
  for (const [property, value] of Object.entries(patch)) {
    const pattern = new RegExp(`(^|;)\\s*${property}\\s*:[^;]*`, "i");
    style = pattern.test(style)
      ? style.replace(pattern, `$1 ${property}: ${value}`)
      : `${style}; ${property}: ${value}`;
  }
  node.attr("style", style.replace(/^;\s*/, "").trim());
};

const tag = (node, id) => {
  if (node) node.attr("data-reveal", id);
};

const FIXES = {
  // --- 02 O Problema --------------------------------------------------------
  "02": ($, section) => {
    const list = childAt($, section, 2);
    const statRow = childAt($, list, 1);
    const statDot = childAt($, statRow, 0);
    const stats = childAt($, statRow, 1);

    // The deck aligns a 92px number against a 26px paragraph on the baseline.
    // The number then lines up with only the paragraph's FIRST line, and the
    // remaining two lines hang below it, which reads as the number floating
    // above its own caption. Centering pairs them properly.
    restyle(stats, { "align-items": "center" });
    for (const index of [0, 1]) {
      const pair = childAt($, stats, index);
      restyle(pair, { "align-items": "center" });
      // Wider captions wrap to two lines instead of three, so each number sits
      // against a block close to its own height.
      restyle(childAt($, pair, 1), { "max-width": "420px", "line-height": "1.35" });
    }

    // The row's bullet dot is pinned to the top by a margin meant for one-line
    // rows. On the tall stats row it ends up orphaned above the content.
    restyle(statRow, { "align-items": "center" });
    restyle(statDot, { "margin-top": "0" });

    tag(childAt($, list, 0), "s02-rastreabilidade");
    tag(statRow, "s02-estatisticas");
    tag(childAt($, list, 2), "s02-tcu");
  },

  // --- 03 Requisitos funcionais --------------------------------------------
  "03": ($, section) => {
    const grid = childAt($, section, 2);
    ["s03-rf01", "s03-rf02", "s03-rf03", "s03-rf04", "s03-rf05"].forEach((id, index) => {
      tag(childAt($, grid, index), id);
    });
  },

  // --- 07 Matriz GUT --------------------------------------------------------
  "07": ($, section) => {
    const table = childAt($, section, 3);
    // Child 0 is the header row; the data rows run US01, US02, US03, US05, US04.
    ["s07-us01", "s07-us02", "s07-us03", "s07-us05", "s07-us04"].forEach((id, index) => {
      tag(childAt($, table, index + 1), id);
    });
  },

  // --- 09 Tempo de espera ---------------------------------------------------
  "09": ($, section) => {
    const chart = childAt($, section, 2);
    ["s09-ortopedia", "s09-cardiologia", "s09-oftalmologia", "s09-oncologia"].forEach(
      (id, index) => {
        tag(childAt($, chart, index), id);
      },
    );
  },

  // --- 11 Decisões estratégicas --------------------------------------------
  "11": ($, section) => {
    const proposals = childAt($, section, 3);
    tag(childAt($, proposals, 0), "s11-proposta01");
    tag(childAt($, proposals, 1), "s11-proposta02");
  },

  // --- 12 Antes x Depois ----------------------------------------------------
  "12": ($, section) => {
    const columns = childAt($, section, 2);
    tag(childAt($, columns, 0), "s12-antes");
    tag(childAt($, columns, 1), "s12-depois");
  },

  // --- 13 Riscos ------------------------------------------------------------
  "13": ($, section) => {
    const columns = childAt($, section, 2);
    tag(childAt($, columns, 0), "s13-risco01");
    tag(childAt($, columns, 1), "s13-risco02");
  },
};

/**
 * Takes the em dashes out of the slide text.
 *
 * The deck already separates labels with a middle dot in half a dozen places
 * ("UBS Vila União · Cardiologia", "SMS · WhatsApp · app"), so labels join that
 * convention. In running prose the dash just goes away.
 */
export function removeEmDashes($, section) {
  let changed = 0;

  const rewrite = (text) =>
    text.replace(/\s*[—–]\s*/g, (match, offset, whole) => {
      const before = whole.slice(0, offset).trim();
      // A short run before the dash is a label, not a clause.
      const isLabel = before.split(/\s+/).filter(Boolean).length <= 3;
      changed++;
      return isLabel ? " · " : " ";
    });

  const walk = (node) => {
    for (const child of $(node).contents().toArray()) {
      if (child.type === "text") {
        const next = rewrite(child.data);
        if (next !== child.data) child.data = next;
      } else if (child.children) {
        walk(child);
      }
    }
  };

  walk(section);
  return changed;
}

/**
 * Rewrites the number printed on a slide to its position in the video.
 *
 * The video follows the narration, and the narration describes the landing page
 * and the MVP screens before the non-functional requirements. Leaving the deck's
 * own numbers in place made the video count 03, 05, 06, 04 on screen. The
 * numbers are a label, the audio is the recording — so the labels move.
 */
export function renumber($, section, displayNumber) {
  const label = String(displayNumber).padStart(2, "0");
  // The eyebrow's first tabular-nums span carries the number.
  const eyebrow = $(section).find("span[style*='tabular-nums']").first();
  if (eyebrow.length) eyebrow.text(label);

  // Cover and closing print "NN / 14" in the footer instead of an eyebrow.
  const total = $(section)
    .find("div")
    .filter((_, el) => /^\d{2}\s*\/\s*\d{2}$/.test($(el).text().trim()));
  total.each((_, el) => {
    const [, count] = $(el).text().trim().split("/");
    $(el).text(`${label} / ${count.trim()}`);
  });
}

export function applyUiFixes($, section, screenLabel) {
  const fix = FIXES[screenLabel];
  if (!fix) return 0;
  fix($, section);
  return $(section).find("[data-reveal]").length;
}
