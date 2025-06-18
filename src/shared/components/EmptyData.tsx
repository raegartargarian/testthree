import { FNoConnectionIcon } from "../icons/NoConnectionIcon";

interface NoActivityProps {
  title: string;
  description: string;
}
const NoActivity = ({ title, description }: NoActivityProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full ">
      <FNoConnectionIcon></FNoConnectionIcon>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-center text-white">{description}</p>
    </div>
  );
};

export default NoActivity;
