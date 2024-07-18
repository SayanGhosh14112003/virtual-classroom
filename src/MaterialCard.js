import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useAuth } from "./context";
import EditIcon from '@mui/icons-material/Edit';
import { Modal } from "antd";
import { Input } from "antd";
export default function MaterialCard({admin,title,time,filePath,id,fileId,setMaterials}) {
  const { TextArea } = Input;
const{getURL,deleteFile,getMaterials,updateFile}=useAuth()
const [value,setValue]=React.useState(title)
const [isModalOpen, setIsModalOpen] = React.useState(false);
async function openFile(){
  const link=await getURL(filePath);
  window.open(link, "_blank");
}
const timestampSeconds=time?.seconds;
const timestampNanoseconds=time?.nanoseconds
var timestampMilliseconds = timestampSeconds * 1000 + Math.round(timestampNanoseconds / 1000000);
var date = new Date(timestampMilliseconds);
var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];
var hour=date.getHours()
var min=date.getMinutes()
var dayOfMonth = date.getDate(); // Day of the month (1-31)
var month = monthNames[date.getMonth()]; // Month (0-11), adding 1 to make it (1-12)
const showModal = () => {
  setIsModalOpen(true);
};
const handleOk = async() => {
  setIsModalOpen(false);
  await updateFile(id,value,fileId);
  const c=await getMaterials(id)
  setMaterials(c?.docs);
};
const handleCancel = () => {
  setIsModalOpen(false);
};
  return (
    <>
      <Card sx={{ maxWidth: 345,border :"2px solid grey"}}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title?title:"No title"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Posted on: {dayOfMonth} {month}  {hour}:{min}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton aria-label="open file" color="primary" onClick={openFile}>
            <InsertDriveFileIcon />
          </IconButton>
          {admin?<>
          <IconButton aria-label="delete file" onClick={showModal}>
            <EditIcon/>
          </IconButton>
          <IconButton aria-label="delete file" color="error" onClick={async ()=>{await deleteFile(id,filePath,fileId);const c=await getMaterials(id)
      setMaterials(c?.docs) }}>
            <DeleteIcon />
          </IconButton>
          </>:null
          }
        </div>
      </CardContent>
    </Card>
    <Modal
        title="Rename Material"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea
          placeholder="Enter New Material Title"
          autoSize
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Modal>
    </>
  );
}
