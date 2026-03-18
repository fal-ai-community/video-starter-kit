import { App } from "@/components/main";
import { PROJECT_PLACEHOLDER } from "@/data/schema";
import { cookies } from "next/headers";

export default function IndexPage() {
  const cookieStore = cookies();
  const lastProjectId = cookieStore.get("__aivs_lastProjectId");
  return <App projectId={lastProjectId?.value ?? PROJECT_PLACEHOLDER.id} />;
}
