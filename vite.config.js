import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // When deploying to GitHub Pages under a repository (e.g. https://<user>.github.io/Musicify)
  // set the `base` option to the repository name (slash-prefixed). This makes built
  // asset URLs point to the correct subpath instead of absolute `/` paths which break
  // when served from a repo page.
  base: '/Musicify/',
  plugins: [
    tailwindcss(),
  ],
})