import React from "react";
import ReactPlayer from "react-player";

export default function MuzickiPlayer({ url }) {
  return (
    <div>
      <ReactPlayer url={url} height="50px" width="450px" controls={true}/>
    </div>
  );
}
