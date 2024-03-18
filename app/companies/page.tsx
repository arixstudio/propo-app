
import { Metadata } from "next/types";
import CompaniesTable from "../components/CompaniesTable";

const CompaniesPage = () => {
  return (
    <>
      <h1 className="text-xl mb-5">Companies</h1>
      <CompaniesTable />
    </>
  );
};

export default CompaniesPage;

export const metadata: Metadata = {
  title: "Propo App - Companies",
  description: "Created by Arash Besharat",
};