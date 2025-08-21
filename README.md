# Marina's Portfolio

Jekyll-powered website.

## Quick start

Prerequisites: Ruby (3.2+ recommended) and Bundler. If you used a version manager, ensure it activates in this directory. Optionally create a `.ruby-version` file containing the version (already provided).

Install gems:

```zsh
bundle install
```

Serve locally with live reload:

```zsh
bundle exec jekyll serve
```

Visit: http://127.0.0.1:4000/

Stop server: Ctrl+C

## Project structure

```
_config.yml        # Site configuration
Gemfile            # Ruby gem dependencies
index.md           # Home page (uses theme layout)
_posts/            # Blog posts (Markdown files named YYYY-MM-DD-title.md)
```

## Build (static files)

```zsh
bundle exec jekyll build   # Outputs to _site/
```

## Deployment (GitHub Pages project site)

You can deploy the contents of the `_site` folder to GitHub Pages (e.g. via GitHub Actions) or enable Pages to build from `main` using GitHub's Jekyll build system. For GitHub to build it natively, you must use the `github-pages` gem instead of direct `jekyll` & set compatible versions (see commented lines in Gemfile). If you switch, run `bundle update` afterwards.

## Customization

- Change site metadata in `_config.yml`.
- Replace theme (currently `minima`) or override layouts by adding files under `_layouts/`.
- Add plugins by listing them in both the Gemfile and `_config.yml`.

## Updating dependencies

```zsh
bundle update
```

## Ruby version

The file `.ruby-version` pins the Ruby version for compatible version managers. Adjust as needed.

## License

Add a license file if you intend to publish the code/content under specific terms.