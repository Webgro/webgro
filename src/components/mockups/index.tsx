import { FunCasesAICustomerService } from "./FunCasesAICustomerService";
import { FunCasesAIProductGenerator } from "./FunCasesAIProductGenerator";
import { FunCasesAIImageGenerator } from "./FunCasesAIImageGenerator";
import { FunCasesWMS } from "./FunCasesWMS";
import { TwistedTailorAISupport } from "./TwistedTailorAISupport";
import { SublishopInventoryPlanner } from "./SublishopInventoryPlanner";
import { SublishopCompetitorTracker } from "./SublishopCompetitorTracker";
import { ConsultancyAuditBoard } from "./ConsultancyAuditBoard";
import { StackIntegrationFlow } from "./StackIntegrationFlow";

export type MockupName =
  | "fun-cases-ai-customer-service"
  | "fun-cases-ai-product-generator"
  | "fun-cases-ai-image-generator"
  | "fun-cases-wms"
  | "twisted-tailor-ai-support"
  | "sublishop-inventory-planner"
  | "sublishop-competitor-tracker"
  | "consultancy-audit-board"
  | "stack-integration-flow";

const registry: Record<MockupName, () => React.ReactElement> = {
  "fun-cases-ai-customer-service": FunCasesAICustomerService,
  "fun-cases-ai-product-generator": FunCasesAIProductGenerator,
  "fun-cases-ai-image-generator": FunCasesAIImageGenerator,
  "fun-cases-wms": FunCasesWMS,
  "twisted-tailor-ai-support": TwistedTailorAISupport,
  "sublishop-inventory-planner": SublishopInventoryPlanner,
  "sublishop-competitor-tracker": SublishopCompetitorTracker,
  "consultancy-audit-board": ConsultancyAuditBoard,
  "stack-integration-flow": StackIntegrationFlow,
};

export function Mockup({ name }: { name: MockupName }) {
  const Component = registry[name];
  if (!Component) return null;
  return <Component />;
}
