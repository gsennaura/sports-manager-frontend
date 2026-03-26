import { listChampionships } from "./infrastructure/composition";
import { HomePage } from "@presentation/pages/HomePage";

export function App() {
  return <HomePage listChampionships={listChampionships} />;
}
