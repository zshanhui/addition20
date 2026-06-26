Simple game for kids to learn addition and subtraction from 1-20, adults can play too!

Demo @ https://adrienshen.github.io/addition20

## Rust/Yew WASM rewrite

The main app is now implemented with [Yew](https://yew.rs/) and compiles to WebAssembly for the browser.

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