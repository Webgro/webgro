import { Closing } from "./Closing";
import { HeroScene } from "./HeroScene";
import { Letter } from "./Letter";
import { PreviewShell } from "./PreviewShell";
import { Proof } from "./Proof";
import { Reviews } from "./Reviews";
import { Routes } from "./Routes";
import { Tools } from "./Tools";
import { WorkReel } from "./WorkReel";

export function PreviewHome({ darkHero = false }: { darkHero?: boolean }) {
  return (
    <PreviewShell initialTheme={darkHero ? "ink" : "paper"}>
      <HeroScene dark={darkHero} />
      <Routes />
      <WorkReel />
      <Letter />
      <Tools />
      <Reviews />
      <Proof />
      <Closing />
    </PreviewShell>
  );
}
