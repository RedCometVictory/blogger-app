import { createBrowserHistory } from 'history';
let history;
typeof window === "undefined" ? null : history = createBrowserHistory();
export default history;