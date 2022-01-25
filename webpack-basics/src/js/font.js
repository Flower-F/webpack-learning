import "../font/iconfont.css";

function setFont() {
  const div = document.createElement("div");

  const span = document.createElement("span");
  span.className = "iconfont icon-gift lg-icon";
  div.appendChild(span);

  document.body.appendChild(div);
}

export default setFont;
