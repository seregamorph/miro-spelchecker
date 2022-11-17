import {createRoot} from 'react-dom/client';
import {App} from "./components/App";
import 'mirotone/dist/styles.css';
import './assets/style.css';

const container = document.getElementById('root');

if (!container) {
    throw new Error('root container not found')
}

const root = createRoot(container);
root.render(<App />);
