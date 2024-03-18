import { Metadata } from "next/types";

export default function Home() {
  return (
    <>
    <h1 className="text-xl">Dashboard</h1>
    <p className="text-gray-400">Nothing mutch here to explore, please see Companies!</p>
    </>
  )
}

export const metadata: Metadata = {
  title: "Propo App - Dashboad",
  description: "Created by Arash Besharat",
};
