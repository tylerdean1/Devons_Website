import { renderToString } from 'react-dom/server';
import App from './App';
import type { View } from './data/routes';

export function render(view: View) {
  return renderToString(<App initialView={view} />);
}
