// Each section is a rough polygon traced over the cemetery map image.
// Points are [x%, y%] percentages across the image (0-100), same coordinate
// system used for plot pins.
//
// These two are ROUGH PLACEHOLDER EXAMPLES just to demonstrate the
// click-to-zoom/highlight behavior. Replace them (and add the rest of the
// garden sections) using section-tracing-helper.html -- open that file,
// click around a garden's border, then export the JSON and paste it here.

export const SECTIONS = [
  {
    name: "All Faiths Garden",
    points: [
      [28, 18],
      [42, 16],
      [46, 26],
      [34, 30],
      [26, 26],
    ],
  },
  {
    name: "Angels Garden",
    points: [
      [44, 20],
      [56, 20],
      [58, 30],
      [46, 32],
    ],
  },
];
