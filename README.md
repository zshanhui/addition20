# README.md

note from 2026: in 2015 i wrote this program while volunteering at a Kampong (village) in Cambodia to teach kids math. i taught myself HTML/CSS/JS to write it and it basically launched my entire technical career. afterwards, i've work for startups and big tech, as well as built my own startups. recently i thought it would be interesting to use AI agents to write it in Rust (seems to be the trend) and use WASM to run it. i think the AI version looks a lot better than my original version.

Simple game for kids to learn addition and subtraction from 1-20, adults can play too!

## Rust/Yew WASM rewrite

The main app is now implemented with [Yew](https://yew.rs/) and compiles to WebAssembly for the browser.

The original JavaScript version is still available at `original-js.html`, and the Yew app links to it so users can choose which version to play.

### Local development

Install the WASM target and Trunk if you do not already have them:

```sh
rustup target add wasm32-unknown-unknown
cargo install trunk
```

Run the app locally:

```sh
trunk serve
```

Build the static browser assets:

```sh
trunk build --release
```

The Trunk build copies `original-js.html` and the `public/` assets into `dist/` so both versions are playable from the built site.