import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';

export default function MemberCard({memberPhoto,memberName,memberEmail,adminEmail}) {
  return (
    <Card sx={{ width: 315, border:"2px solid black", display:"inline-block" ,margin:"2px"}}>
     
     <CardHeader
     avatar={<Avatar  src={memberPhoto} /> }
        title={memberName}
        subheader={memberEmail}
      />
    </Card>
  );
}