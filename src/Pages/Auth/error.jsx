import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="flex justify-center min-h-screen items-center flex-col">
      <h1 className="text-3xl font-bold">THE LAST SHOW</h1>
      <p className="my-5 text-xl ">Teusah Sambarang yang Di cek-cek SU</p>
      <p className=" text-xl">{error.statusText || error.message}</p>
    </div>
  );
};
export default ErrorPage;
