import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { useAuth } from "./context";
import { useParams } from "react-router-dom";
import AnnouncementCard from "./AnnouncementCard";
import {Empty} from 'antd'
const { TextArea } = Input;
export default function Announcement({ admin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [value, setValue] = useState("");
  const { auth,uploadAnnouncement, getAnnouncements } = useAuth();
  const { id } = useParams();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    await uploadAnnouncement(value, id);
    const c = await getAnnouncements(id);
    setAnnouncements(c?.docs);
    setValue("");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    (async () => {
      const c = await getAnnouncements(id);
      setAnnouncements(c?.docs);
    })();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,300px)",
          justifyContent: "space-around",
          rowGap: "10px",
        }}>
        {announcements?.map((e) => {
          return(
          <AnnouncementCard key={e.data().id} admin={admin} message={e.data().announcement} time={e.data().time} id={id} fileId={e.data().id} setAnnouncements={setAnnouncements}/>
          )
        })
        }
      {(!auth || announcements?.length==0)?<><div style={{ position:"absolute", left:"0px", margin:0,width:"100vw", display:"flex",justifyContent:"center"}}>
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
          }}>
          <Fab color="primary" onClick={showModal}>
            <AddIcon />
          </Fab>
        </Paper>
      ) : null}
      <Modal
        title="Add New Announcement"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <TextArea
          placeholder="Enter Announcement"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoSize={{
            minRows: 3,
            maxRows: 5,
          }}
        />
        <div style={{ margin: "24px 0" }} />
      </Modal>
    </>
  );
}
