class MyTip {
  constructor() {
    this.init();
  }
  init() {}
  css(tip, myjson) {
    for (let key in myjson) tip.style[key] = myjson[key];
  }
  createTip(msg, bgcolor, borderColor) {
    const tip = document.createElement("p");
    tip.className = "mytip";

    this.css(tip, {
      transition: "all 4s",
      position: "fixed",
      top: "50%",
      transform: "translate(-50%, 0)",
      left: "50%",
      padding: "10px",
      color: "white",
      border: "2px solid #fff",
      borderColor: borderColor,
      backgroundColor: bgcolor
    });
    setTimeout(() => {
      this.css(tip, {
        top: "-10%",
        transform: " translate(-50%, -100%)",
        opacity: 0.5
      });
    }, 100);
    tip.innerText = msg;
    this.destoryTip(tip);
    document.getElementById("app").appendChild(tip);
  }
  destoryTip(tip) {
    tip.addEventListener("animationend", function() {
      this.remove();
    });
  }
}

export { MyTip };
