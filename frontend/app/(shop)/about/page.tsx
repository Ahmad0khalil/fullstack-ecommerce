import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "About",
  description: "Who we are and how we work.",
};

const principles = [
  {
    title: "We keep the catalog small",
    body: "Every product on this site is something we'd buy ourselves. We'd rather sell fifty things well than five thousand things poorly.",
  },
  {
    title: "Prices don't move for no reason",
    body: "No flash sales designed to create urgency, no prices inflated the week before a discount. What you see is what it costs.",
  },
  {
    title: "A real person reads every message",
    body: "Support isn't outsourced to a script. If something's wrong with an order, you'll hear back from someone who can actually fix it.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <p className="text-sm text-muted-foreground">About</p>
      <h1 className="mt-3 max-w-xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        A small store, run by people who use what they sell.
      </h1>
      <p className="mt-6 max-w-[60ch] text-base leading-7 text-muted-foreground sm:text-lg">
        We started this store because we kept buying the same handful of
        things from a handful of different places and thought there should
        be one place that carried all of them, at a fair price, with
        someone accountable on the other end.
      </p>

      <Separator className="my-14" />

      <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {principles.map((p) => (
          <div key={p.title}>
            <h2 className="text-base font-medium text-foreground">
              {p.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {p.body}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-14" />

      <div className="flex flex-col justify-between gap-6 text-sm text-muted-foreground sm:flex-row sm:items-baseline">
        <p className="max-w-md leading-6">
          Have a question about an order, a product, or anything else?
          We'd rather you ask than wonder.
        </p>
        <a
          href="/contact"
          className="shrink-0 text-foreground underline underline-offset-4"
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}