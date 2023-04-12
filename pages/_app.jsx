import "../styles/globals.css";

function App({ Component, pageProps }) {
  const layout = Component.layout || (page => page)
  const page = <Component {...pageProps} />

  return layout(page)
}

export default App;
