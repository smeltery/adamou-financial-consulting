import { blankClient, transition, type Client, type Stage } from "./model";
/** Development-only fixtures; never imported by the production bundle. */
export function sampleClients(): Client[] {
  return [
    "Alex Morgan",
    "Taylor Reed",
    "Jordan Blake",
    "Casey Parker",
    "Robin Ellis",
    "Sam Rivera",
  ].map((name, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index * 15);
    const client = transition(
      {
        ...blankClient(),
        name,
        email: `sample${index}@example.com`,
        priority: [
          "Build a comfortable emergency fund",
          "Make a clear plan for debt",
          "Set up a monthly budget",
        ][index % 3],
        source: index % 2 ? "manual" : "website",
        created_at: date.toISOString(),
        next_contact: new Date(
          Date.now() + (index - 2) * 86400000,
        ).toLocaleDateString("en-CA"),
        goals: [
          {
            id: crypto.randomUUID(),
            title: "Agree on a practical first step",
            done: index % 2 === 0,
          },
        ],
      },
      (
        [
          "inquiry",
          "onboarding",
          "active",
          "active",
          "offboarding",
          "archived",
        ] as Stage[]
      )[index],
    );
    return client;
  });
}
