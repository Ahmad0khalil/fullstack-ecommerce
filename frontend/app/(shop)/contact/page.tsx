import { ContactForm } from "@/components/forms/ContactForm";

export const metadata = {
  title: "Contact",
  description: "Get in touch with us.",
};

const channels = [
  { label: "Email", value: "hello@yourstore.com" },
  { label: "Response time", value: "Usually within one business day" },
  { label: "Order issues", value: "Include your order number if you have one" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <div className="grid gap-16 sm:grid-cols-5 sm:gap-12">
        <div className="sm:col-span-2">
          <h1 className="text-4xl font-medium tracking-tight text-foreground">
            Contact
          </h1>
          <p className="mt-4 max-w-[40ch] text-sm leading-6 text-muted-foreground">
            Send us a message and it goes straight to a person, not a
            queue. Order questions, product questions, anything.
          </p>

          <dl className="mt-10 space-y-6">
            {channels.map((c) => (
              <div key={c.label}>
                <dt className="text-sm text-muted-foreground">{c.label}</dt>
                <dd className="mt-1 text-sm text-foreground">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="sm:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}