import { GlobalSelectors } from "@/containers/global/selectors";
import React from "react";
import { useSelector } from "react-redux";
import { Footer } from "./Footer";
import { Header } from "./Header";
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const authData = useSelector(GlobalSelectors.authData);

  return (
    <div className="flex flex-col min-h-screen u-bg bg-cover bg-center bg-fixed bg-no-repeat bg-black">
      <div className=" min-h-screen">
        {authData ? (
          <>
            {" "}
            <Header />
            <main className=" flex justify-center min-h-[85vh]">
              {children}
            </main>
            <Footer />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PageLayout;
