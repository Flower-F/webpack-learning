import "../less/title.less";
import "../css/test.css";

function setTitle(title) {
  const h1 = document.createElement("h1");
  h1.innerHTML = title;
  h1.className = "title";
  document.body.appendChild(h1);
}

export default setTitle;
