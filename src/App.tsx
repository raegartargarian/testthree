import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AttachmentDetailPage } from "./containers/attachmentDetail/loadable";
import { ProofOfReserveAttachmentsPage } from "./containers/attachments/loadable";
import { DashboardPage } from "./containers/dashboard/loadable";
import AuthModal from "./shared/components/AuthModal";
import PageLayout from "./shared/components/PageLayOut";
import ScrollToTop from "./shared/components/ScrollToTop";
import { appRoutes } from "./shared/constants/routes";

function App() {
  useEffect(() => {
    // add the class u-bg to the html element
    document.documentElement.classList.add("u-bg");
  }, []);
  return (
    <HashRouter>
      <AuthModal />

      <ScrollToTop />

      <Routes>
        {/* Routes with Header and Footer */}
        <Route
          path={appRoutes.dashboard.path}
          element={
            <PageLayout>
              <DashboardPage />
            </PageLayout>
          }
          index
        />
        <Route
          path={appRoutes.attachments.path}
          element={
            <PageLayout>
              <ProofOfReserveAttachmentsPage />
            </PageLayout>
          }
        />
        <Route
          path={appRoutes.attachmentsDetail.path}
          element={
            <PageLayout>
              <AttachmentDetailPage />
            </PageLayout>
          }
        />

        {/* Route without Header and Footer (do not wrap in PageLayout) */}
      </Routes>
    </HashRouter>
  );
}

export default App;
