import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import { useEffect, useState,useRef } from "react";
import { Modal } from "antd";
import {Empty} from 'antd'
import { Input } from "antd";
import { useAuth } from "./context";
import { useParams } from "react-router-dom";
import MaterialCard from "./MaterialCard";
export default function Material({ admin }) {
  const { TextArea } = Input;
  const [value, setValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const {auth,uploadMaterials,getMaterials}=useAuth();
  const { id } = useParams();
  const [materials,setMaterials]=useState([])
  const upload=useRef(null)
  useEffect(()=>{
    (async()=>{
      const c=await getMaterials(id)
      setMaterials(c?.docs) 
    })()
    // eslint-disable-next-line
  },[])
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async() => {
    setIsModalOpen(false);
    await uploadMaterials(selectedFile,value,id);
    const c=await getMaterials(id)
    setMaterials(c?.docs)
    setSelectedFile(null);
    setValue("");
    upload.current.value=null;
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,300px)",justifyContent: "space-around", rowGap:"10px"}}>
    {
      materials?.map((e)=>{
        return(
         <MaterialCard key={e.data().filePath} admin={admin} title={e.data().title} time={(e.data().time)} filePath={e.data().filePath} id={id} fileId={e.data().fileId} setMaterials={setMaterials}/>
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
        <input type="file" onChange={handleFileChange} ref={upload}/>
      </Modal>
    </>
  );
}
