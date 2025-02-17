"use strict";

import esbuild from "esbuild";

const isMinified = process.argv.includes("--minify");

class ESBuild {
  constructor() {
    this.config = {
      bundle: true,
      sourcemap: isMinified,
      platform: "node",
      target: ["node20"],
      legalComments: "none",
      minify: !isMinified,
      treeShaking: true,
      tsconfig: "tsconfig.json",
    };

    this.esbuild = esbuild;
  }

  build() {
    this.esbuild
      .build({
        ...this.config,
        entryPoints: process.argv.slice(2),
        outdir: "dist",
      })
      .then(() => {
        this.config.watch ? console.log("Watching...") : console.log("Bundling complete");
      });
  }
}

console.log("Building...", process.argv.slice(2));
const bundler = new ESBuild();
bundler.build();
