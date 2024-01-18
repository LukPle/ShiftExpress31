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
- A Header to navigate to various sections
- Our launch page using a framer motion animation
- Our Project Section - providing some general information
- Our KeyFindings Section - Here Users can choose on what excatly they want to research and find out more about
- Selecting a KeyFinding navigates to the KeyFinding itself. Here we've built intercative timeline, map and bar charts. The timeline controls the timeframe where as map and bar chart can be used to select individual states. A Key Finding also has various filters that focus on specific aspects of these charts.
- Currently only the Transportation Shift KeyFinding is fully built
- Our Team Section presenting us
- And currently a repository of all the charts we have built for later use in the remaining KeyFindings