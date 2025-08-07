import s from "./imagePart.module.css";
import avatar from "../../assets/avatar.png";
import blueiMac from "../../assets/blueiMac.svg";

const ImagePart = () => {
  return (
    <div className={s.imagePartContainer}>
      <img src={avatar} alt="avatar" className={s.avatar} />
      <img src={blueiMac} alt="blueiMac" className={s.blueiMac} />
    </div>

  );
};

export default ImagePart;
