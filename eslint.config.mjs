import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    // Experimental React Compiler rules (eslint-plugin-react-hooks v6 RC, shipped by
    // eslint-config-next 16). They flag idiomatic patterns as errors — hydrating
    // client-only state from localStorage, syncing a controlled input, and shadcn's
    // own vendored components. The stable hooks rules (rules-of-hooks, exhaustive-deps)
    // stay enabled.
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default eslintConfig;
