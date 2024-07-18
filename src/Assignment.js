import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import { Modal } from "antd";
import { useEffect, useState,useRef } from "react";
import { Input } from "antd";
import { useAuth } from "./context";
import { useParams } from "react-router-dom";
import AssignmentCard from "./AssignmentCard";
import {Empty} from 'antd'
import {RetweetOutlined } from '@ant-design/icons'
const { TextArea } = Input; 
export default function Material({ admin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [value, setValue] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const {auth,uploadAssignment,getAssignments}=useAuth();
  const { id } = useParams();
  const [materials,setMaterials]=useState([])
  const upload=useRef(null)
  useEffect(()=>{
    (async()=>{
      const c=await getAssignments(id)
      setMaterials(c?.docs) 
    })()
    // eslint-disable-next-line
  })
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async() => {
    setIsModalOpen(false);
    await uploadAssignment(selectedFile,value,id);
    const c=await getAssignments(id)
    setMaterials(c?.docs) 
    setSelectedFile(null);
    setValue("");
    upload.current.value=null;
  };
  const handleOk1= async() => {
    setIsModalOpen1(false);
    await uploadAssignment(value2,value1,id);
    const c=await getAssignments(id)
    setMaterials(c?.docs) 
    setValue1("");
    setValue2("");

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  return (
    <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,300px)",justifyContent: "space-around", rowGap:"10px"}}>
    {
      materials?.map((e)=>{
        return(
         <AssignmentCard key={e.data().fileId} admin={admin} title={e.data().title} time={(e.data().time)} filePath={e.data().filePath} id={id} fileId={e.data().fileId} setAssignments={setMaterials} quiztype={e.data().quiztype}/>
        )
      })
    }
    {(!auth || materials?.length==0)?<><div style={{position:"absolute", left:"0px",margin:0,width:"100vw", display:"flex",justifyContent:"center"}}>
          <Empty/>
          </div>
          </>:null}
    </div>
      {admin ? (
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
      ) : null}
      <Modal
        title="Add New Material"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea
          placeholder="Enter Material Title"
          autoSize
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div style={{ margin: "24px 0" }} />
        <input type="file" onChange={handleFileChange} ref={upload} />
        <div style={{ margin: "24px 0" }} />
        <RetweetOutlined style={{fontSize:"30px"}}onClick={()=>{setIsModalOpen(!isModalOpen);setIsModalOpen1(!isModalOpen1)}}/>
      </Modal>
      <Modal
        title="Add New Material"
        open={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel1}
      >
        <TextArea
          placeholder="Enter Material Title"
          autoSize
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
        />
          <div style={{ margin: "12px 0" }} />
        <TextArea
          placeholder="Add link"
          autoSize={{
            minRows: 3,
            maxRows: 5,
          }}
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
        />
        <div style={{ margin: "5px 0" }} />
        <a href="http://g.co/createaquiz" target={"_blank"}>Create a Quiz</a>
        <div style={{ margin: "24px 0" }} />
        <RetweetOutlined style={{fontSize:"30px"}} onClick={()=>{setIsModalOpen(!isModalOpen);setIsModalOpen1(!isModalOpen1)}}/>
      </Modal>
    </>
  );
}
