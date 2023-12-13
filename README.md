# InfoVis 23 - Team 31 - 🚗 Traffic Data

This is the main repository for Team 31's InfoVis web application built with Next.js. It includes a set of UI components styled with Joy UI, and integrated with D3 for data visualizations.

## Website
You can visit the current version of the website through this link: https://team-31-iv2324-projects-9267fe386ec9af87e7d6c214ab1ee355db087ee.pages.gitlab.lrz.de

## Roadmap
Currently, we visualized most of our data in basic bar/line charts to continuously gain insights and ideas about how to better organize them as we develop our product.
In addition to this, we've set the ground work for our key findings philosophy. The architecture has been developed and the first charts for the key finding "transportation shift" have been impemented in basic form.
Next steps are to clean up the existing architecture, fix bugs, adapt the styling and finalize the other key findings. 🚀

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

One of our visualization components is a map of Germany's federal states. To implement the map using d3 js, we needed a GeoJSON file
containing geographical information about these states. For this purpose, we used a json file found on a Github repository: https://github.com/isellsoap/deutschlandGeoJSON/blob/main/2_bundeslaender/1_sehr_hoch.geo.json. Following the structure of our project, this
file can be found in src/data/germany-states.json.
