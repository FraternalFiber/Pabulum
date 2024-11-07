import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "@/helpers/routes.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Menu />
        <Main>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Main>
      </BrowserRouter>
      {/* Component for displaying toasts */}
      <Toaster richColors visibleToasts={1} />
      {/* Dev tools */}
      {/*<ReactQueryDevtools initialIsOpen={false} buttonPosition={"bottom-left"} />*/}
    </QueryClientProvider>
  );
}

export default App;
