# Improvements after 1.1.0

These are proposed priorities, not features included in the submitted 1.1.0 package. Keep runtime changes for the next version separate from release documentation.

1. **Check update compatibility.** Add a repeatable upgrade check using representative older saved history and settings. Existing records should remain readable and exportable without losing optional purchase details.
2. **Improve autofill feedback.** Explain when a product price could not be detected and make manual entry easy. Cover missing prices, sale prices, multiple currencies, and pages with several products before changing extraction rules.
3. **Make history easier to use.** Explore search and sorting for larger saved lists. Preserve record IDs, exported data, and comparison behavior.
4. **Review accessibility on real devices.** Check keyboard navigation, screen-reader announcements, zoom, and mobile website layouts. Include Arabic and languages with longer labels.

For each change, define the expected behavior, implement it, run relevant checks, and review it locally. Before the next Store submission, update the version and release notes, run the full release pipeline, and follow the [manual review checklist](releases/manual-review.md).
