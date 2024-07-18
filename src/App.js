import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from '@mui/material/Avatar';
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { useAuth } from "./context";
import { Spin } from "antd";
import { Empty } from "antd";
import Card from "./Card";
import UserCard from "./Profile";
export default function App() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const {
    auth,
    login,
    logout,
    createClass,
    joinClass,
    getClasses,
    setSpinning,
    spinning,
  } = useAuth();
  const [classes, setClasses] = useState([]);
  const [joinClassroomName, setJoinClassroomName] = useState("");
  const [joinClassroomDes, setJoinClassroomDes] = useState("");
  const [joinClassroomCode, setJoinClassroomCode] = useState("");
  useEffect(() => {
    (async () => {
      const c = await getClasses();
      setClasses(c?.docs);
    })();
    // eslint-disable-next-line
  }, [auth]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [meetingId, setMeetingId] = React.useState("");

  const isMenuOpen1 = Boolean(anchorEl);
  const isMenuOpen2 = Boolean(anchorE2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAddMenuOpen = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const [openJoinMeetingModal, setOpenJoinMeetingModal] = React.useState(false);

  const handleClickOpenJoinMeetingModal = () => {
    setOpenJoinMeetingModal(true);
  };

  const handleCloseJoinMeetingModal = () => {
    setOpenJoinMeetingModal(false);
  };

  const [openJoinClass, setOpenJoinClass] = React.useState(false);

  const handleClickOpenJoinClass = () => {
    setOpenJoinClass(true);
  };

  const handleCloseJoinClass = () => {
    setOpenJoinClass(false);
  };

  const [openCreateClass, setOpenCreateClass] = React.useState(false);

  const handleClickOpenCreateClass = () => {
    setOpenCreateClass(true);
  };

  const handleCloseCreateClass = () => {
    setOpenCreateClass(false);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu1 = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={isMenuOpen1}
      onClose={handleMenuClose}>
     {auth?<MenuItem onClick={handleOpenDialog }>My account</MenuItem>:null}
      {auth ? (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            logout();
          }}>
          Logout
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            login();
          }}>
          Login
        </MenuItem>
      )}
    </Menu>
  );
  const renderMenu2 = (
    <Menu
      anchorEl={anchorE2}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={isMenuOpen2}
      onClose={handleMenuClose}>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleClickOpenJoinClass();
        }}>
        Join Class
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleClickOpenCreateClass();
        }}>
        Create Class
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem onClick={handleAddMenuOpen}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <AddRoundedIcon />
        </IconButton>
        <p>Add Class</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleClickOpenJoinMeetingModal();
        }}>
        <IconButton size="large" color="inherit">
          <VideocamOutlinedIcon />
        </IconButton>
        <p>Start Meet</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit">
          <AccountCircle />
        </IconButton>
        <p>My Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Spin spinning={spinning} fullscreen size="large"/>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 0 }}>
              <AutoStoriesOutlinedIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { sm: "block" } }}>
              Virtual Classroom
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Tooltip title="Add Class">
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  onClick={handleAddMenuOpen}
                  color="inherit">
                  <AddRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Start Meet">
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={handleClickOpenJoinMeetingModal}>
                  <VideocamOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="My Profile">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit">
                  {auth?.photoURL?<Avatar src={auth?.photoURL} sx={{ width: 30, height: 30 }} />:<AccountCircle />}
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit">
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu2}
        {renderMenu1}
        <React.Fragment>
          <Dialog
            open={openJoinMeetingModal}
            onClose={handleCloseJoinMeetingModal}
            PaperProps={{
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                handleCloseJoinMeetingModal();
              },
            }}>
            <DialogTitle>Virtual Classroom Meeting</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Welcome to our Virual Classroom Meeting
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                name="email"
                label="Enter Meeting ID"
                type="name"
                fullWidth
                variant="standard"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                required
              />
            </DialogContent>
            <Stack
              direction="column"
              spacing={0.5}
              justifyContent="center"
              alignItems="center"
              mb={2.5}>
              <Button
                variant="outlined"
                target="_blank"
                href={`https://video-calling-app-uij7.onrender.com/?meetingID=${meetingId}`}
                >
                Join Meeting
              </Button>
              <DialogContentText>OR</DialogContentText>
              <Button
                variant="outlined"
                target="_blank"
                href={`https://video-calling-app-uij7.onrender.com/?meetingID=${Math.floor(Math.random()*100000000)}`}
                >
                Create a New Meeting
              </Button>
            </Stack>
          </Dialog>
        </React.Fragment>
        <React.Fragment>
          <Dialog
            open={openJoinClass}
            onClose={handleCloseJoinClass}
            PaperProps={{
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                handleCloseJoinClass();
              },
            }}>
            <DialogTitle>Join New Class</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Welcome to Virtual Classroom
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="email"
                label="Enter Class Code"
                type="name"
                fullWidth
                variant="standard"
                value={joinClassroomCode}
                onChange={(e) => setJoinClassroomCode(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseJoinClass}>Cancel</Button>
              <Button
                type="submit"
                onClick={async() => {
                  setSpinning(true);
                  await joinClass(joinClassroomCode);
                  const c = await getClasses();
                  setClasses(c?.docs);
                  setJoinClassroomCode("");
                  setSpinning(false);
                }}>
                Join
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
        <React.Fragment>
          <Dialog
            open={openCreateClass}
            onClose={handleCloseCreateClass}
            PaperProps={{
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                const email = formJson.email;
                console.log(email);
                handleCloseCreateClass();
              },
            }}>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Welcome to Virtual Classroom
              </DialogContentText>
              <TextField
                required
                margin="dense"
                id="name"
                name="email"
                label="Enter Class Name"
                type="name"
                fullWidth
                variant="standard"
                value={joinClassroomName}
                autoFocus
                onChange={(e) => setJoinClassroomName(e.target.value)}
              />
              <TextField
                required
                margin="dense"
                id="name"
                name="email"
                label="Enter Description"
                type="name"
                fullWidth
                variant="standard"
                value={joinClassroomDes}
                onChange={(e) => setJoinClassroomDes(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCreateClass}>Cancel</Button>
              <Button
                type="submit"
                onClick={async() => {
                  setSpinning(true);
                  await createClass(joinClassroomName, joinClassroomDes);
                  const c = await getClasses();
                  setClasses(c?.docs);
                  setJoinClassroomName("");
                  setJoinClassroomDes("");
                  setSpinning(false);
                }}>
                Create
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{textAlign: 'center'}}>User Profile</DialogTitle>
        <DialogContent>
          <UserCard onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
        </React.Fragment>
      </Box>
      <br />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,300px)",
          justifyContent: "space-around",
          rowGap: "10px",
          marginTop:"55px"
        }}>
        {classes?.map((e) => {
          return (
            <Card
              key={e.data().classId}
              className={e.data().className}
              classDescription={e.data().classDescription}
              creatorName={e.data().creatorName}
              classId={e.data().classId}
              setClasses={setClasses}
            />
          );
        })}
      </div>
      {(!auth || classes?.length==0)? (
        <>
          <div
            style={{
              margin: 0,
              maxWidth: "100vw",
              display: "flex",
              justifyContent: "center",
            }}>
            <Empty />
          </div>
        </>
      ):null}
    </>
  );
}
