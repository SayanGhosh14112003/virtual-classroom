import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { useAuth } from "./context";
import { useNavigate } from 'react-router-dom';

export default function MultiActionAreaCard({
  className,
  classDescription,
  creatorName,
  classId,
  setClasses
}) {
  const navigate=useNavigate()
  const { leaveClass ,setSpinning,getClasses} = useAuth();
  return (
    <Card sx={{ width: 300, boxShadow: 4 }}>
      <CardActionArea onClick={() => navigate(`/classroom/${classId}`)}>
        <CardMedia
          component="img"
          height="140"
          src="https://media.slidesgo.com/storage/2023145/responsive-images/8-school-backgrounds-for-virtual-classroom___media_library_original_937_527.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {className}
          </Typography>
          <Typography
            variant="body1"
            display="block"
            color="text.secondary"
            component="div"
          >
            {classDescription}
          </Typography>
          <Typography variant="body1" textAlign="right" component="div">
            {creatorName}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          size="medium"
          color="primary"
          onClick={async () => {
            setSpinning(true);
            await leaveClass(classId);
            const c = await getClasses();
            setClasses(c?.docs);
            setSpinning(false);
          }}
        >
          Leave Class
        </Button>
      </CardActions>
    </Card>
  );
}
