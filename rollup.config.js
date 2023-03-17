import path from "path"
import typescript2 from "rollup-plugin-typescript2"
import dts from "rollup-plugin-dts"

export default [
  {
    input: "./src/core/index.ts",
    output: [
      {
        file: path.resolve(__dirname, "dist/index.esm.js"),
        format: "es",
      },
      {
        file: path.resolve(__dirname, "dist/index.cjs.js"),
        format: "cjs",
      },
      {
        file: path.resolve(__dirname, "dist/index.js"),
        format: "umd",
        name: "SccTracker",
      },
    ],
    plugins: [typescript2()],
  },
  {
    input: "./src/core/index.ts",
    output: [
      {
        file: path.resolve(__dirname, "dist/index.t.ts"),
        format: "es",
      },
    ],
    plugins: [dts.default()],
  },
]
