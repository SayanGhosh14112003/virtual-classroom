import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useAuth } from "./context";
export default function SubmissionCard({
  admin,
  title,
  time,
  filePath,
  id,
  fileId,
  userName,
  userEmail,
  handleClickOpen
}) {
  const { getURL, deleteSubmission, auth} = useAuth();
  console.log(id);
  async function openFile() {
    const link = await getURL(filePath);
    window.open(link, "_blank");
  }
  const timestampSeconds = time?.seconds;
  const timestampNanoseconds = time?.nanoseconds;
  var timestampMilliseconds =
    timestampSeconds * 1000 + Math.round(timestampNanoseconds / 1000000);
  var date = new Date(timestampMilliseconds);
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var hour = date.getHours();
  var min = date.getMinutes();
  var dayOfMonth = date.getDate(); // Day of the month (1-31)
  var month = monthNames[date.getMonth()]; // Month (0-11), adding 1 to make it (1-12)

  return (
    <>
      <Card sx={{ maxWidth: 345, border: "2px solid grey" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title ? title : "No title"}
          </Typography>
          <Typography gutterBottom variant="body2" component="div">
            {userName}
          </Typography>
          <Typography gutterBottom variant="body2" component="div">
            {userEmail}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Posted on: {dayOfMonth} {month} {hour}:{min}
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              aria-label="open file"
              color="primary"
              onClick={openFile}
            >
              <InsertDriveFileIcon />
            </IconButton>
            {userEmail == auth?.email ? (
              <>
                <IconButton
                  aria-label="delete file"
                  color="error"
                  onClick={async () => {
                    await deleteSubmission(id, filePath, fileId);
                    await handleClickOpen()
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
