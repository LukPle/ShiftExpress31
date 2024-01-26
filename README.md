# InfoVis 23 - Team 31 - 🚗 Traffic Data

This is the main repository for Team 31's InfoVis web application built with Next.js. It includes a set of UI components styled with Joy UI, and integrated with D3 for data visualizations.

## Website
You can visit the current version of the website through this link: https://team-31-iv2324-projects-9267fe386ec9af87e7d6c214ab1ee355db087ee.pages.gitlab.lrz.de

## Roadmap
Currently, we've develoepd an MVP version of our desired visualisation. All key functionalities have been implemented. This includes: various charts to visualize both car and public transportation data, the mein site structure, our KeyFinding functionality, and the first fully developed KeyFinding.
Next steps are to add the remaining KeyFindings and to clean up the site - making it ready to ship 🚀

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js version ~~14~~ 20 or above (https://nodejs.org/)
- You have installed Git (https://git-scm.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repository (can also use git-client):
```bash
git clone https://gitlab.lrz.de/iv2324-projects/team-31.git
cd team-31
```
2. Install npm packages:
```bash
npm install 
```
List of some dependencies:
- [Joy UI](https://mui.com/joy-ui/getting-started/installation/)
- [d3.js](https://d3js.org/getting-started)
- [Material Icons](https://mui.com/material-ui/material-icons/)
3. Run the development server:
```bash
npm run dev
```
Open http://localhost:3000 with your browser to see the result.

### Content

Feature List:
- Our launch page featuring a framer motion animation.
- Our Project Section providing general information about the project.
- Our KeyFindings Section, where users can choose which topics they want to explore and learn more about.
- Interactive KeyFinding pages with timeline, map, and bar charts, where the timeline controls the timeframe and the map and bar charts allow for selection of individual states.
- Enhanced interactivity across all KeyFindings, with multiple bar charts and map charts equipped with tooltips for precise information on each federal state.
- Predefined filter options in all KeyFindings to aid user engagement and ease chart interpretation.
- An integrated timeline chart in each KeyFinding for enhanced user exploration.
- Design considerations for color-blind and low vision accessibility, ensuring inclusive and user-friendly color choices.
- Interactive highlighting feature linking map and bar charts, allowing mutual highlighting of states across the charts.
- Our Team Section showcasing the project contributors.