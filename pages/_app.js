import { ClickToComponent } from "click-to-react-component";
import "../styles/index.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ClickToComponent />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
