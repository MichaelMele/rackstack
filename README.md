# RackStack

A web app for making dimensioned elevation drawings of warehouse storage racks. Choose a rack type, enter the measurements, and the drawing updates as you type.

## Why I built it

Simple rack elevations, which show how tall the uprights are and where each level sits, are usually drawn by hand or in CAD. That is slow when you only need a quick idea of a layout. I wanted to see whether a small web app could do it from a few numbers, and to use the project to learn:

- Managing React state across many related inputs
- Drawing and updating SVG graphics from data
- Building a responsive layout that also works well on a phone

## Features

- **Two rack types**
  - **Cantilever rack:** column height, base height, arm length, arm count, arm height and arm clearance
  - **Pallet rack:** frame height, beam length, beam height, beam count and beam clearance
- **Uniform or custom spacing:** space every level evenly, or set each level's clearance yourself
- **Automatic dimension lines:** each level's clearance and the open space above the top level are measured and labeled (in inches)
- **Zoom and pan** on the drawing, using [`svg-toolbelt`](https://www.npmjs.com/package/svg-toolbelt)
- **Mobile-friendly:** a slide-out settings panel, touch-sized controls, and responsive sizing

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) for icons
- [svg-toolbelt](https://www.npmjs.com/package/svg-toolbelt) for zoom and pan

## Getting started

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone <your-repo-url>
cd canti-eq
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the development server     |
| `npm run build` | Make a production build          |
| `npm run start` | Run the production build         |
| `npm run lint`  | Run ESLint                       |

## Project structure

```
app/
  layout.tsx          Root layout, fonts and page metadata
  page.tsx            Main page: rack settings form and drawing logic
  app.js              Helper functions that draw SVG rects and text
  globals.css         Tailwind setup and color tokens
components/
  ZoomableSvg.tsx     React wrapper around svg-toolbelt for zoom and pan
```

## How it works

1. Each rack measurement is stored in React state.
2. A `useEffect` hook runs whenever a measurement changes. It clears the SVG and redraws the rack from scratch using `drawElement` and `drawText` in `app/app.js`.
3. Measurements are in inches, and 1 SVG unit equals 1 inch. The drawing group is flipped vertically, so y = 0 is the floor and the rack builds upward, the way you would measure a real one.
4. The SVG sits inside `ZoomableSvg`, which handles zooming and panning.

## What I learned

- Keeping lists of values (such as the custom clearance for each level) in sync with a count input
- Coordinate systems in SVG, and why flipping the y-axis makes the math for physical objects easier to reason about
- Designing forms for touch screens 
- Making a slide-out panel that works with a keyboard

## Ideas for future work

- [ ] Export the drawing as SVG, PNG or PDF
- [ ] Draw racks with React components instead of editing the DOM by hand
- [ ] Validate inputs (for example, warn when the levels don't fit within the column or frame height)
- [ ] Add more rack types (drive-in, flow rack and others)
- [ ] Show several bays side by side in a plan view

## License

Made for educational purposes. Feel free to look around and learn from it.
