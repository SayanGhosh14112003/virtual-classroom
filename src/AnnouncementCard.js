import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from './context';
//
import EditIcon from '@mui/icons-material/Edit';
import { Modal } from "antd";
import { Input } from "antd";
//
const AnnouncementCard = ({ admin, message, time, id,fileId,setAnnouncements}) => {
  //
  const { TextArea } = Input;
  const [value,setValue]=React.useState(message)
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const {deleteAnnouncement,getAnnouncements,updateAnnouncement}=useAuth()
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async() => {
    setIsModalOpen(false);
    await updateAnnouncement(id,value,fileId);
    const c=await getAnnouncements(id)
    setAnnouncements(c?.docs);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //
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
var dayOfMonth = date.getDate(); // Day of the month (1-31)
var month = monthNames[date.getMonth()];
var hour=date.getHours()
var min=date.getMinutes()
  return (
    <>
    <Card variant="outlined" style={{border:"2px solid grey"}}>
      <CardContent>
        <Typography variant="body1" color="text.primary" gutterBottom style={{ wordWrap: 'break-word' }}>
          {message}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Posted on {dayOfMonth} {month}  {hour}:{min}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {admin?<>
          <IconButton aria-label="delete file" onClick={showModal}>
            <EditIcon/>
          </IconButton>
        <IconButton
          aria-label="delete"
          style={{ marginLeft: 'auto', color: 'red' }}
          onClick={async()=>{await deleteAnnouncement(id,fileId);const c = await getAnnouncements(id);
            setAnnouncements(c?.docs);}}
        >
          <DeleteIcon />
        </IconButton>
        </>:null
        }
        </div>
      </CardContent>
    </Card>
    <Modal
        title="Update Announcement"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea
          placeholder="Enter New Announcement"
          autoSize
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default AnnouncementCard;
