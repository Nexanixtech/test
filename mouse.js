
document.addEventListener("DOMContentLoaded", () => {
  // If admin page, do nothing
  if (document.body.classList.contains("admin-page")) {
    return;
  }

  const drone = document.createElement("img");
  drone.src = "./images/drone.png"; // place drone image inside ./images/
  drone.className = "drone-cursor";
  document.body.appendChild(drone);

  let lastX = 0;
  let lastY = 0;

  document.addEventListener("mousemove", (e) => {
  
    // Drone movement
    const dx = e.pageX - lastX;
    const dy = e.pageY - lastY;
    lastX = e.pageX;
    lastY = e.pageY;

    // Base rotation to point in direction of movement
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Add tilt effect depending on horizontal speed
    let tilt = 0;
    if (Math.abs(dx) > 2) {
      tilt = dx > 0 ? 15 : -15; // tilt right if moving right, left if moving left
    }

    drone.style.left = e.pageX + "px";
    drone.style.top = e.pageY + "px";
    drone.style.transform = `translate(-50%, -50%) rotate(${angle}deg) skewX(${tilt}deg)`;

    // Trail effect
    const trail = document.createElement("div");
    trail.className = "drone-trail";
    trail.style.left = e.pageX + "px";
    trail.style.top = e.pageY + "px";
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 500);
  });
});
