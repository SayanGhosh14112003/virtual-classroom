import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@mui/styles";
import { useAuth } from "./context";
import MemberCard from "./MemberCard";
const useStyles = makeStyles({
  section: {
    marginBottom: "20px",
  },
  field: {
    marginBottom: "15px",
    fontSize: "1.1rem",
    fontFamily: "Roboto, sans-serif",
    display: "flex",
    alignItems: "center",
  },
  label: {
    marginRight: "10px",
    fontWeight: "bold",
  },
  copyButton: {
    marginLeft: "5px",
  },
});

const AboutSection = ({
  className,
  classDescription,
  creatorName,
  classCode,
  adminEmail
}) => {
  const classes = useStyles();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(classCode);
  };
  const { getMembers } = useAuth();
  const [members, setMembers] = useState([]);
  useEffect(() =>{(async()=>{
    const c = await getMembers(classCode);
    setMembers(c?.docs);
})()}, []);
  return (
    <div>
      <Box className={classes.section}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          About This Class
        </Typography>
        <Divider />
      </Box>
      <div className={classes.field}>
        <Typography variant="h6" gutterBottom className={classes.label}>
          Class Name:
        </Typography>
        <Typography variant="h6" gutterBottom>
          {className}
        </Typography>
      </div>
      <div className={classes.field}>
        <Typography variant="h6" gutterBottom className={classes.label}>
          Class Description:
        </Typography>
        <Typography variant="h6" gutterBottom>
          {classDescription}
        </Typography>
      </div>
      <div className={classes.field}>
        <Typography variant="h6" gutterBottom className={classes.label}>
          Class Code:
        </Typography>
        <Typography variant="h6" gutterBottom>
          {classCode}
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<FileCopyIcon />}
            onClick={copyToClipboard}
            className={classes.copyButton}
          >
            Copy
          </Button>
        </Typography>
      </div>
      <div className={classes.field}>
        <Typography variant="h6" gutterBottom className={classes.label}>
          Creator's Name:
        </Typography>
        <Typography variant="h6" gutterBottom>
          {creatorName}
        </Typography>
      </div>
      <div className={classes.field}>
        <Typography variant="h6" gutterBottom className={classes.label}>
          Creator's Email:
        </Typography>
        <Typography variant="h6" gutterBottom>
          {adminEmail}
        </Typography>
      </div>
      <div className={classes.field}>
        <Typography variant="h6" gutterBottom className={classes.label} textAlign="center"  width="100vw">
          All Members
          <hr/>
        </Typography>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,315px)",justifyContent: "space-around", rowGap:"10px"}}>
        {members?.map((e) => {
          return (
            <MemberCard
              key={e.data().filePath}
              memberPhoto={e.data().memberPhoto}
              memberName={e.data().memberName}
              memberEmail={e.data().memberEmail}
              adminEmail={adminEmail}
            />
          );
        })}
        </div>
    </div>
  );
};

export default AboutSection;
