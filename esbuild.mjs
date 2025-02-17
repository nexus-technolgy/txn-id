"use strict"

import esbuild from "esbuild"

const isProduction = process.env.NODE_ENV == "production"

class ESBuild {
  constructor() {
    this.config = {
      bundle: true,
      sourcemap: !isProduction,
      platform: "node",
      target: ["node20"],
      legalComments: "none",
      minify: isProduction,
      treeShaking: true,
      tsconfig: "tsconfig.json",
    }

    this.esbuild = esbuild
  }

  build() {
    this.esbuild
      .build({
        ...this.config,
        entryPoints: process.argv.slice(2),
        outdir: "dist",
      })
      .then(() => {
        this.config.watch ? console.log("Watching...") : console.log("Bundling complete")
      })
  }
}

console.log("Building...", process.argv.slice(2))
const bundler = new ESBuild()
bundler.build()
