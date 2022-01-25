import "../css/bg.css";
import imgSrc from "../img/ai2.jpg";

function setImage() {
  const div = document.createElement("div");

  const img = document.createElement("img");
  img.src = imgSrc;
  div.appendChild(img);

  const backgroundImg = document.createElement("div");
  backgroundImg.className = "bg-img";
  div.appendChild(backgroundImg);

  document.body.appendChild(div);
}

export default setImage;
