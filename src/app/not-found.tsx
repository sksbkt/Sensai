import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className=" h-[100dvh] flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-semibold gradient-title">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-4"
      >
        <Button
          variant={"outline"}
          className=" text-white"
        >
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
