# Portfolio — Vinit Agarwal

A portfolio built around one idea: show the distributed systems work instead of
describing it. Interactive architecture map, engineering case studies, and an
arcade of small games and sandboxes that model the real problems — routing,
failure, hashing, debouncing.

Live: [vinitagarwal.vercel.app](https://vinitagarwal.vercel.app)

## Run it

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  data/site.js                  all copy: services, experience, projects, skills
  app/
    components/                 sections (Hero, Architecture, Experience, …)
      NetworkCanvas.js          ambient cluster animation behind the hero
      arcade/
        PacketRouter.js         canvas arcade game — route packets to providers
        ChaosMonkey.js          keep the fleet above its SLA
        HashRing.js             consistent hashing sandbox
        DebounceLab.js          Redis-style burst collapsing
        Shell.js                interactive résumé shell
```

Everything is written from scratch — no chart, animation or carousel libraries.
The only dependencies are Next.js and React.

## Editing content

Nearly all copy lives in [`src/data/site.js`](src/data/site.js). Services in the
architecture map use descriptive names and neutral slugs rather than internal
repository names; change `name`/`slug` there if that should ever differ.
