import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from "./context";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Input, Modal } from "antd";
import SubmissionCard from "./SubmissionCard";
import {Empty} from 'antd'
import { Spin } from "antd";
import EditIcon from '@mui/icons-material/Edit';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function MaterialCard({admin,title,time,filePath,id,fileId,setAssignments,quiztype}) {
  const { TextArea } = Input;
  const [open, setOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const { auth,getURL, deleteAssignment,uploadSubmission,getSubmissions,spinning,getAssignments,updateAssignment} = useAuth();
  const [materials,setMaterials]=React.useState([])
  const upload=React.useRef(null);
  const [value1,setValue1]=React.useState(title)
  const [isModalOpen1, setIsModalOpen1] = React.useState(false);
  const handleClickOpen = async() => {
    setOpen(true);
    const c=await getSubmissions(id,fileId,admin)
    setMaterials(c?.docs) 
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOk = async() => {
    setIsModalOpen(false);
   //hg setOpen(false);
    await uploadSubmission(selectedFile,value,id,fileId);
    const c=await getSubmissions(id,fileId,admin)
    setMaterials(c?.docs)
    setValue("");
    setSelectedFile(null);
    upload.current.value=null;
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  async function openFile(){
    if(quiztype)window.open(filePath,"_blank")
    else{
      const link = await getURL(filePath);
    window.open(link, "_blank");
    }
  }

  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const handleOk1 = async() => {
    setIsModalOpen1(false);
    await updateAssignment(id,value1,fileId);
    const c=await getAssignments(id)
    setAssignments(c?.docs);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  const timestampSeconds = time?.seconds;
  const timestampNanoseconds = time?.nanoseconds;
  const timestampMilliseconds = timestampSeconds * 1000 + Math.round(timestampNanoseconds / 1000000);
  const date = new Date(timestampMilliseconds);
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  const hour = date.getHours();
  const min = date.getMinutes();
  const dayOfMonth = date.getDate();
  const month = monthNames[date.getMonth()];
  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <Card sx={{ maxWidth: 345, border: "2px solid grey" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title ? title : "No title"}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Posted on: {dayOfMonth} {month} {hour}:{min}
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton aria-label="open file" color="primary" onClick={openFile}>
              <InsertDriveFileIcon />
            </IconButton>
            {
            !quiztype&&<IconButton aria-label="upload file" color="secondary">
              <CloudUploadIcon onClick={handleClickOpen} />
            </IconButton>
            }
            {admin &&
              <>
              <IconButton aria-label="delete file" onClick={showModal1}>
            <EditIcon/>
          </IconButton>
                <IconButton aria-label="delete file" color="error" onClick={async() => { await deleteAssignment(id, filePath, fileId);const c=await getAssignments(id)
      setAssignments(c?.docs)  }}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          </div>
        </CardContent>
        <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <>
        <Spin spinning={spinning} fullscreen size="large"/>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Submissions
            </Typography>
          </Toolbar>
        </AppBar>
        <br/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,300px)",justifyContent: "space-around", rowGap:"10px"}}>
    {
      materials?.map((e)=>{
        return(
         <SubmissionCard key={e.data().filePath} admin={admin} title={e.data().title} time={(e.data().time)} filePath={e.data().filePath} id={id} fileId={e.data().fileId} userName={e.data().uploader} userEmail={e.data().uploaderEmail} handleClickOpen={handleClickOpen}/>
        )
      })
    }
    {(!auth || materials?.length==0)?<><div style={{position:"absolute", left:"0px",margin:0,width:"100vw", display:"flex",justifyContent:"center"}}>
          <Empty/>
          </div>
          </>:null}
    </div>
        <Paper
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            borderRadius: "100%",
          }}
        >
          <Fab color="primary" onClick={showModal}>
            <AddIcon />
          </Fab>
        </Paper>
        <Modal
        title="Add New Material"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        zIndex={3000}
      >
        <TextArea
          placeholder="Enter Material Title"
          autoSize
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div style={{ margin: "24px 0" }} />
        <input type="file" onChange={handleFileChange} ref={upload}/>
      </Modal>
        </>
      </Dialog>
      </Card>
      <Modal
        title="Rename New title"
        open={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel1}
      >
        <TextArea
          placeholder="Enter New Title"
          autoSize
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
        />
      </Modal>
    </>
  );
}
