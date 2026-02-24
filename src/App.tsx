import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import IndexPage from "./pages/IndexPage";
import MasterCvPage from "./pages/MasterCvPage";
import JobsListPage from "./pages/JobsListPage";
import JobDetailPage from "./pages/JobDetailPage";
import MatchPage from "./pages/MatchPage";
import ExportPdfPage from "./pages/ExportPdfPage";
import { TestFlowPage } from "./pages/TestFlowPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "cv", element: <MasterCvPage /> },
      { path: "jobs", element: <JobsListPage /> },
      { path: "jobs/:id", element: <JobDetailPage /> },
      { path: "match/:id", element: <MatchPage /> },
      { path: "test-flow", element: <TestFlowPage /> },
    ]
  },
  {
    // Clean layout for ATS PDF export
    path: "/export/:id",
    element: <ExportPdfPage />
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
