// Get the canvas element by its ID
const canvas = document.getElementById('myCanvas');

// Check if the canvas element exists and supports 2D drawing
if (canvas.getContext) {
    // Get the 2D rendering context
    const ctx = canvas.getContext('2d');

    // --- 1. Display a filled rectangle ---
    ctx.fillStyle = 'rgba(255, 99, 71, 0.8)'; // Tomato color
    // Draws a filled rectangle at (50, 50) with size 150x100
    ctx.fillRect(50, 50, 150, 100);

    // --- 2. Display a filled circle ---
    ctx.fillStyle = 'rgba(60, 179, 113, 0.9)'; // Medium Sea Green color
    ctx.beginPath(); // Start a new path
    // arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.arc(350, 100, 40, 0, Math.PI * 2); // Full circle
    ctx.fill();
    ctx.closePath();

    // --- 3. Display a straight line ---
    ctx.strokeStyle = '#4682b4'; // Steel Blue color
    ctx.lineWidth = 5;
    ctx.beginPath();
    // Start the line path
    ctx.moveTo(200, 250); 
    // Define the line end point
    ctx.lineTo(450, 200); 
    ctx.stroke(); // Render the line
    ctx.closePath();

    // --- 4. Display the text “HTML5 Canvas” ---
    ctx.fillStyle = '#333333'; // Dark Gray color
    ctx.font = '30px "Arial Black", sans-serif'; 
    ctx.textAlign = 'center'; // Center the text on the x-coordinate
    
    // Positioned near the bottom center (250 is half of the 500 width)
    ctx.fillText('HTML5 Canvas', 250, 280); 

} else {
    // Console message if the browser doesn't support canvas
    console.error("Canvas not supported by this browser.");
}