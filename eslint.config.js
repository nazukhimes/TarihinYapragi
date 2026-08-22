import js from "@eslint/js";
import ts from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default ts.config(
  { ignores: ["dist", "node_modules", "coverage"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      // Not: eklentinin `recommended` seti (v7+) React Compiler'a yönelik ~16 kural
      // içeriyor (ör. `preserve-manual-memoization`, `set-state-in-effect`) — bu proje
      // React 18'de, derleyici olmadan çalışıyor, o kurallar idiomatik useEffect/
      // useCallback kalıplarını yanlış pozitif olarak işaretliyor. Yalnızca klasik
      // ikili (T-12'nin kendi amacı — bkz. talimat notu) açıkça seçiliyor.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["*.config.{js,ts}", "scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  }
);
