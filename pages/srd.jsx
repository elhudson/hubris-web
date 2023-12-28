import { useParams } from "react-router-dom";
import { useAsync } from "react-async-hook";
import { sql_danger } from "utilities";
import { css } from "@emotion/css";
import Rules from "@rules";
console.log(Rules)

export const Srd = () => {
  const { table } = useParams();
  const Page=Rules[table]
  return (
    <>
      <h1>{sql_danger(table)}</h1>
      <Page />
    </>
  );
};


