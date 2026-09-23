import Game from "../puzzle";
import "./warehouse.css";
import { scenario } from "../../data/case.mjs";
export default function Warehouse() {
  return <Game scenario={scenario} source="Archived local prototype" />;
}
