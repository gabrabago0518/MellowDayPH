export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white text-zinc-900">
      {/* Header */}
      <header className="border-b border-blue-700 bg-blue-600">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold tracking-tight text-white">
            Mellow Day PH
          </span>
          <nav className="hidden gap-8 text-sm font-medium text-blue-100 sm:flex">
            <a href="#about" className="hover:text-white">
              About
            </a>
            <a href="#offerings" className="hover:text-white">
              Offerings
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            Get in touch
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          A mellow day, every day.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
          This is a placeholder landing page for Mellow Day PH — swap in your
          own copy, images, and branding whenever you&apos;re ready.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#offerings"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Explore
          </a>
          <a
            href="#contact"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Contact us
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight">About</h2>
          <p className="mt-4 max-w-2xl text-zinc-600">
            Write a short paragraph here about what Mellow Day PH is and why
            it exists. Keep it simple — a sentence or two is plenty for a
            landing page.
          </p>
        </div>
      </section>

      {/* Offerings */}
      <section id="offerings" className="border-t border-zinc-200">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            Offerings
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Item One", body: "A short description goes here." },
              { title: "Item Two", body: "A short description goes here." },
              { title: "Item Three", body: "A short description goes here." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-200 p-6"
              >
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer
        id="contact"
        className="mt-auto border-t border-zinc-200 bg-zinc-50"
      >
        <div className="mx-auto max-w-5xl px-6 py-12 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Get in touch
          </h2>
          <p className="mt-2 text-zinc-600">hello@mellowdayph.example</p>
          <p className="mt-8 text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} Mellow Day PH. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
