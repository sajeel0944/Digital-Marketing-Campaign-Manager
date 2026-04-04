import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import rich
from Agent.assistant import run_agent
from Typeschema.AiBrief import AiBriefSchema

# ------ Simple Test Execution ------

test_input = AiBriefSchema(
    name="SnapGuard AI",
    industry="AI & Mobile Security",
    website="https://snapguard.example.com", # Sample URL
    campaign_objective="conversion",
    target_audience="Tech-savvy mobile users and digital nomads.",
    budget=12000.0,
    tone="professional",
    imagery_style="Cyberpunk aesthetics, neon highlights, high-tech interface overlays.",
    do_and_dont="Do focus on speed and safety. Don't use stock photos of locks or shields."
)

print("\n[bold yellow]🧪 Running Simple Test...[/bold yellow]")
result = run_agent(test_input)

# Final Result Print
if __name__ == "__main__":
    rich.print("\n[bold green]🎯 Final Backend-Ready JSON:[/bold green]")
    print(result)