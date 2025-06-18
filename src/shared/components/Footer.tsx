import filedGrLogo from "@/assets/logo/fildgr.svg";
import logo from "@/assets/logo/logo.png";
export const Footer = () => {
  return (
    <footer className="bg-black">
      <div className=" mx-auto">
        <div className="h-24 border-t border-t-gray-150">
          <div className="flex flex-col md:grid md:grid-cols-3 justify-between items-center container mx-auto h-full">
            {" "}
            <div className="">
              <img src={logo} alt="" className="w-24" />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="hover:text-green-300 hover:cursor-pointer">
                Contact
              </div>
              <span>|</span>
              <div className="hover:text-green-300 hover:cursor-pointer">
                Imprint
              </div>
              <span>|</span>
              <div className="hover:text-green-300 hover:cursor-pointer">
                Privacy Policy
              </div>
              <span>|</span>
              <div className="hover:text-green-300 hover:cursor-pointer">
                Privacy Settings
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-sm flex justify-end space-x-2">
              <span>by: </span>
              <img src={filedGrLogo} alt="" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
