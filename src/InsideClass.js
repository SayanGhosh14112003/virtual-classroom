import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {  useParams } from "react-router-dom";
import { useAuth } from "./context";
import { useEffect, useState } from "react";
import "./App.css";
import Material from "./Material";
import { Spin } from "antd";
import AboutSection from "./AboutClass";
import Announcement from "./Announcement";
import  Assignment from "./Assignment";
export default function InsideClass() {
  const { id } = useParams();
  const { auth, getClassDetails,spinning } = useAuth();
  const [room, setRoom] = useState(null);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    (async () => {
      const classroom = await getClassDetails(id);
      setRoom(classroom);
      console.log(room);
    })();
  }, []);
  return (
    <>
    <Spin spinning={spinning} fullscreen size="large"/>
      <Box sx={{ typography: "body1"}}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider"}}>    
            <TabList onChange={handleChange} aria-label="lab API tabs example" variant="scrollable"
        scrollButtons="auto" >
              <Tab label="Materials" value="1" />
              <Tab label="Announcements" value="2" />
              <Tab label="Assignments" value="3" />
              <Tab label="About Class" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Material admin={room?.creatorEmail==auth?.email}/>    
          </TabPanel>
          <TabPanel value="2">
            <Announcement admin={room?.creatorEmail==auth?.email}/>     
          </TabPanel>
          <TabPanel value="3">
            <Assignment admin={room?.creatorEmail==auth?.email}/>     
          </TabPanel>
          <TabPanel value="4">
            <AboutSection className={room?.className} classDescription={room?.classDescription} creatorName={room?.creatorName} classCode={id} adminEmail={room?.creatorEmail}/>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
