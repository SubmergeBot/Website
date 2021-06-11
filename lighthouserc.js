module.exports = {
  ci: {
    collect: { staticDistDir: "./dist" },
    upload: {
      target: "lhci",
      serverBaseUrl: "https://andre4ik3-lhci.herokuapp.com",
    },
    assert: { preset: "lighthouse:recommended" },
  },
};
