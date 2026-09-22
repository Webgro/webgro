import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import { Reviews } from "../Reviews";
import { AboutHero } from "./AboutHero";
import { Room } from "./Room";
import { Story } from "./Story";
import { Team } from "./Team";
import { Years } from "./Years";
import "./about.css";

export function AboutView() {
  return (
    <PreviewShell initialTheme="paper">
      <AboutHero />
      <Story />
      <Years />
      <Team />
      <Room />
      <Reviews limit={3} />
      <Closing />
    </PreviewShell>
  );
}
