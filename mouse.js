
document.addEventListener("mousemove", (e) => {
  const ripple = document.createElement("div");
  ripple.className = "cursor-ripple";
  ripple.style.left = e.clientX + "px";
  ripple.style.top = e.clientY + "px";
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});
