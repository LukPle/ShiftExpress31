import React from 'react';
import { Typography, Stack, Card, AccordionGroup, Accordion, AccordionSummary, AccordionDetails } from "@mui/joy";
import { Train, DirectionsCar, MergeType } from "@mui/icons-material";
import MapChart from '../MapComponents/Map';
import TimeLineChart from './TimeLineChart';
import LineChartTim from './LineChartTim';  
import BarChartPT from './ChartsPT/BarChartPT';
import BarChartPTDev from './ChartsPT/BarChartPTDevelopment';
import BarChartCar from './ChartsCars/BarChartCar';
import BarChartCarDev from './ChartsCars/BarChartCarDevelopment';
import LineChartPT from './ChartsPT/LineChartPT';
import LineChartCar from './ChartsCars/LineChartCar';
import BarChartDevelopmentCombined from './ChartsCombined/BarChartDevelopmentCombined';
import BarChartCombined from './ChartsCombined/BarChartCombined';
import pTData from "../../data/pT.json";
import carData from "../../data/car.json";
import popData from "../../data/population.json";
import styles from "../../styles/index.module.css";

interface BaseChartsSectionProps {
    // Add any props you need for the component here
}

const BaseChartsSection: React.FC<BaseChartsSectionProps> = () => {
    return (
        <div className={styles.scrollableContainer}>
        <AccordionGroup size="lg" sx={{ my: 3, minWidth: "100%" }}>
          <Accordion>
            <AccordionSummary>Map</AccordionSummary>
            <AccordionDetails>
              <Stack direction={"column"}>
                <Typography level="h3" mt={4}>
                  Explore Yourself
                </Typography>
                <Stack direction={"row"} mt={2}>
                  <MapChart />
                </Stack>
                <LineChartTim carData={carData} transportData={pTData} startYear='2013' endYear='2019' />
                <TimeLineChart startYearProp="2013" endYearProp="2022" />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>Charts</AccordionSummary>
            <AccordionDetails>
              <Typography level="h3" mt={4} startDecorator={<Train />}>
                Insights: <i>&nbsp;Public Transportation</i>
              </Typography>
              <AccordionGroup size="lg" sx={{ my: 3, minWidth: "100%" }}>
                <Accordion>
                  <AccordionSummary>
                    Total PT Data in specific Year
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ my: 3 }}>
                      <BarChartPT data={pTData} populationData={popData} />
                    </Card>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Total PT Data development over Time
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ my: 3 }}>
                      <LineChartPT data={pTData} />
                    </Card>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Total PT Data change over Interval
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ my: 3, minWidth: "100%" }}>
                      <BarChartPTDev data={pTData} />
                    </Card>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>

              <Typography level="h3" mt={4} startDecorator={<DirectionsCar />}>
                Insights: <i>&nbsp;Cars</i>
              </Typography>
              <AccordionGroup size="lg" sx={{ my: 3, minWidth: "100%" }}>
                <Accordion>
                  <AccordionSummary>Car Data in specific Year</AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ my: 3 }}>
                      <BarChartCar data={carData} populationData={popData} />
                    </Card>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Car Data development over Time
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ my: 3 }}>
                      <LineChartCar data={carData} />
                    </Card>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Car Data change over Interval
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ my: 3 }}>
                      <BarChartCarDev data={carData} />
                    </Card>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>

              <Typography level="h3" mt={4} startDecorator={<MergeType />}>
                Insights: <i>&nbsp;Combining Data Sets</i>
              </Typography>
              <AccordionGroup size="lg" sx={{ my: 3, minWidth: "100%" }}>
                <Accordion>
                  <AccordionSummary>
                    Combined Data development over Time
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ my: 3 }}>
                      <BarChartDevelopmentCombined
                        carData={carData}
                        transportData={pTData}
                      />
                    </Card>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Combined Data in specific Year
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ my: 3 }}>
                      <BarChartCombined
                        carData={carData}
                        transportData={pTData}
                        populationData={popData}
                      />
                    </Card>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
        </div>
    );
};

export default BaseChartsSection;
