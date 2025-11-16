import { MainNav } from "./main-nav";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Homestead Planner</h1>
          <p className="text-xs text-muted-foreground">
            Garden • Livestock • Meals • ROI
          </p>
        </div>
        <MainNav />
      </div>
    </header>
  );
}
