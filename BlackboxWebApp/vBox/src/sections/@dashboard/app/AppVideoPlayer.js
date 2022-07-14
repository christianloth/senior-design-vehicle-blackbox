import React from "react";

// material
import { Card, CardHeader } from '@mui/material';
// utils

export default function AppVideoPlayer(params) {
  return (
      <Card>
      <CardHeader title="Video Player" subheader="Here is the video footage from our camera."/>

        <div>
            <iframe
                width="540"
                height="320"
                src={`https://vboxbucket.s3.amazonaws.com/${  params.tripNum  }.mp4`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="video"
            />
        </div>

    </Card>
  );
}
