import { Popup } from "./Popup";
import { useState } from "react";

export default {
  title: "Elements/Popup",
  component: Popup,
  argTypes: {
    children: { control: "text" },
    open: { control: "boolean" },
    onClose: { action: "Closed" },
  },
};

export const AlertExample = () => {
  const [openPopup, setOpenPopup] = useState(true);
  return (
    <Popup open={openPopup} onClose={() => setOpenPopup(false)}>
      <h1>WARNING: Your computer is running out of memory and will explode!</h1>
      <p>
        Click <a href="https://www.youtube.com/watch?v=3D-3ewSqaYk">[HERE]</a>{" "}
        to download more RAM immediately.
      </p>
    </Popup>
  );
};
