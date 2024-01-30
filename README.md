# InfoVis 23 - Team 31 - 🚗 Traffic Data

This is the main repository for Team 31's InfoVis web application built with Next.js. It includes a set of UI components styled with Joy UI, and integrated with D3.js for data visualizations.

## Topic
This project revolves around the topic of transportation, specifically in Germany.  Starting from a data from [the Federal Statistical Office of Germany](https://www.destatis.de/EN/Home/_node.html), its aim is to provide insights about public transportation and car usage in Germany.

## Data Sets
Besides the aforementioned main dataset, we additionally relied on 2 other data sets.
This table describes briefly each of the datasets.
| Data Set/Source      | Description |
| :---        |    :----:   |
| [The Federal Statistical Office of Germany - Table Example](https://www-genesis.destatis.de/genesis//online?operation=table&code=46181-0015&bypass=true&levelindex=0&levelid=1697718366080#abreadcrumb) | The specific link shows an example table data about bus and train usage. However, we additionally looked at tables containing data about the population and car ownership in Germany as well.|
| [Check24 - Article Example](https://www.check24.de/unternehmen/presse/pressemitteilungen/mecklenburg-vorpommern-legen-die-meisten-kilometer-mit-dem-auto-zurueck-1126/) | We relied on several similar yearly articles such as this one to get data about driven Kilometers per federal state in a specific year.|


## Website
You can visit the website via this [link](https://team-31-iv2324-projects-9267fe386ec9af87e7d6c214ab1ee355db087ee.pages.gitlab.lrz.de)! 

### Content
The website is divided into 5 main sections, each having a unique purpose:
1. Introduction into the project and its context.
2. A thorough overview of its background, relevance and objectives.
3. The visualization section, which constitutes the main part of the project. It contains 3 key insights that we derived from the data using their corresponding visualizations.
4. A view depicting each key finding's specific visualization. At first glance, this section is not directly displayed. To reach it, one has to choose one of the three key findings. This view contains:
    1. A line chart, which we will refer to as "the timeline chart". This component depicts yearly cumulative % changes in specific metrics related to our topic.
    2. A bar chart that shows % changes for each state.
    3. A map of Germany that displays the change seen in the bar chart to its geographical area.
5. A section to introduce our team.

### Features
This table summarizes and specifies the features implemented on the website, and maps each feature into its encapsulating section to help you finding where to try it out directly.
| Feature Description | Section |
| :---        |    :----:   |
|The launch page features a framer motion animation|(1)|
|The user can choose which insight they want to explore in depth |(3)|
|Clicking on a key finding leads to an interactive view containing visualizations |(3), (4)|
|Each visualization contains a line chart, a map and a bar chart |(4)|
|Play/pause and stop buttons to control the animation for each key finding|(4)|
|The animation is synchronized for all 3 visualization components|(4)|
|The timeline chart allows the user to hover over a specific year for detailed information |(4.I)|
|The bar chart and map allow the user to hover specific federal states for detailed information |(4.II), (4.III)|
|Interactive highlighting feature linking map and bar charts, allowing mutual highlighting of states across the charts |(4.II), (4.III)|
|The map has a built-in filter to switch between the public transportation data set and the cars data set |(4.III)|
|Enhanced interactivity across all key findings, with multiple bar charts and map charts equipped with tooltips for precise information on each federal state |(4)|
|Pre-defined filter options in all key findings to aid user engagement and ease chart interpretation |(4)|
|Design considerations for color-blind and low vision accessibility, ensuring inclusive and user-friendly color choices |all sections|


## Roadmap - 
This section depicts the milestones achieved over the implementation phase. Through the course of the project, it has been updated depending on the current milestone's requirements.

### Status - Until Milestone 4
At this point of the project we've developed an MVP version of our desired visualization. All key functionalities have been implemented. This includes: various charts to visualize both car and public transportation data, the main site structure, our "key finding" functionality, and the first fully developed key finding.
Next steps are to add the remaining Key findings and to clean up the site, making it ready to ship 🚀

### Status - Today
It's ready to ship 🚀

## Local Execution
To get a local copy up and running on your PC, follow these simple steps.

### Prerequisites
Before you begin, ensure you have met the following requirements:

- You have installed Node.js version 20 or above (https://nodejs.org/)
- You have installed Git (https://git-scm.com/)

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


## Team
We are a team of five Master students at LMU Munich. We've already introduced ourselves on the website in the team section. If you haven't seen it yet, please go ahead and do so. You'll notice it's worth it.
