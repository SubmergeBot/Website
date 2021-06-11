module.exports = {
  ci: {
    collect: { staticDistDir: "./dist", numberOfRuns: 1 },
    upload: {
      target: "lhci",
      serverBaseUrl: "https://andre4ik3-lhci.herokuapp.com",
    },
    assert: { preset: "lighthouse:no-pwa" },
  },
};
