import { discoveryResponse, getLlmFullText } from "@/lib/discovery";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  return discoveryResponse(getLlmFullText(), "text/plain");
}
