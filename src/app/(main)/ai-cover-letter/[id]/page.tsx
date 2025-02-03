import React from "react";

const CoverLetterPage = async ({ params }: { params: { id: string } }) => {
  const id = await params.id;
  return <div className="mt-24">CoverLetterPage for ID: {id}</div>;
};

export default CoverLetterPage;

// ? Catch all segments
// const CoverLetterPage = async ({ params }: { params: { id: string[] } }) => {
//   const id = await params.id;
//   console.log(id[0]);

//   return <div className="mt-24">CoverLetterPage for ID: {id}</div>;
// };
