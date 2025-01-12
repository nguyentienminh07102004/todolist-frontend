import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import App from "./App.tsx";
import { allReducers } from "./redux/reducers/allReducers.ts";
import "./tailwind/style.css";

const store = createStore(allReducers);
createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
	<QueryClientProvider client={new QueryClient()}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</QueryClientProvider>
	</Provider>
);
