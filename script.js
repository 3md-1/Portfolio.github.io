// --- Project Data ---
const projectsData = [
    {
        id: 0,
        title: "Synthesizing Landscapes",
        subheading: "Jameel Arts Center, Dubai",
        description: "A live A/V set with artist Aakarsh Singh as a part of the 2025 Jameel Arts Youth Assembly.",
        images: [
            "Media/Synthesizing-3.jpeg",
            "Media/Synthesizing-2.jpeg",
            "Media/Synthesizing-1.jpeg",
        ]
    },
    {
        id: 1,
        title: "in Time",
        subheading: "Louvre, Abu Dhabi",
        description: "Part of the 2024-2025 University Takeover even at the Louvre Abu Dhabi.",
        images: [
            "https://images.unsplash.com/photo-1505664115085-5b553c316788?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop",
        ]
    },
    {
        id: 2,
        title: "LAND: Local Access Network Diptych",
        subheading: "NYUAD, Abu Dhabi",
        description: "Part of the 2025 NYUAD Capstone. Will be showcased, in part, at the Ars Electronica 2025.",
        images: [
            "Media/LAND-1.jpeg",
            "Media/LAND-2.jpeg",
            "Media/LAND-3.jpeg",
        ]
    },
     {
        id: 3,
        title: "The Eye in the Sands",
        subheading: "NYUAD, Abu Dhabi",
        description: "A combination of creative computing and filmmaking. Will be shown at Ars Electronica 2025 in Linz, Austria.",
        images: [
            "Media/The-Eye-1.jpeg",
            "Media/The-Eye-2.jpeg",
            "Media/The-Eye-3.jpeg",
        ]
    },
     {
        id: 4,
        title: "To Water A Dying Garden",
        subheading: "MIZA, Abu Dhabi",
        description: "Interactive installation with artist Aakarsh Singh at MIZA Abu Dhabi as part of The Neighborhood Alley Spring 2024 event.",
         images: [
            "https://images.unsplash.com/photo-1525923838299-2d121659c667?q=80&w=1935&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1587329828594-1ff61096a6f3?q=80&w=1935&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558221434-2e212440f6b3?q=80&w=1964&auto=format&fit=crop",
        ]
    }
];

// --- Page Navigation ---
const mainContent = document.getElementById('main-content');
const projectDetailPage = document.getElementById('project-detail-page');
const backToHomeBtn = document.getElementById('back-to-home');

function showProjectDetails(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    // Populate content
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-subheading').textContent = project.subheading;
    document.getElementById('project-description').textContent = project.description;

    const mainImage = document.getElementById('project-main-image');
    mainImage.src = project.images[0];
    mainImage.alt = project.title;

    const thumbnailsContainer = document.getElementById('project-thumbnails');
    thumbnailsContainer.innerHTML = '';
    project.images.forEach((imgSrc, index) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Thumbnail ${index + 1}`;
        if (index === 0) img.classList.add('active');
        img.onclick = () => {
            mainImage.src = imgSrc;
            document.querySelector('.thumbnail-track img.active').classList.remove('active');
            img.classList.add('active');
        };
        thumbnailsContainer.appendChild(img);
    });

    // Show/Hide pages
    mainContent.style.display = 'none';
    projectDetailPage.style.display = 'block';
    window.scrollTo(0,0);
    noLoop(); // Stop p5.js animation
}

function showHomePage() {
    mainContent.style.display = 'block';
    projectDetailPage.style.display = 'none';
    loop(); // Resume p5.js animation
}

backToHomeBtn.onclick = (e) => {
    e.preventDefault();
    showHomePage();
};

document.querySelectorAll('.carousel-item').forEach(item => {
    item.onclick = () => {
        const projectId = parseInt(item.getAttribute('data-project-id'));
        showProjectDetails(projectId);
    }
});

// --- Modal Logic ---
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
document.getElementById('project-main-image').onclick = () => {
    modalImage.src = document.getElementById('project-main-image').src;
    modal.style.display = 'flex';
};
modal.onclick = () => {
    modal.style.display = 'none';
}


// --- P5.JS SKETCH ---
const pointCount = 400;
const baseSphereRadius = 150;
const userRotationSpeed = 0.01;
const autoRotationSpeed = Math.PI / 180;

let fullText = "INTERACTIVITY<br>MAKES THE WORLD<br>GO ROUND";
let typedText = "";
let typeIndex = 0;
let textElement, geminiButton;
let points = [], rotX = 0, rotY = 0, isDragging = false, isGenerating = false;
let currentScale = 1.0, currentAlpha = 100, currentTextOpacity = 1.0;

function startTyping(newText) {
    fullText = newText.toUpperCase().replace(/\n/g, '<br>');
    typedText = "";
    typeIndex = 0;
}

async function generateNewText() {
    geminiButton.disabled = true;
    geminiButton.classList.add('loading');
    isGenerating = true;

    // Reverted to the original, more complex prompt.
    const prompt = `Generate a short, two-line, impactful phrase inspired by the philosophical concepts of Deleuze & Guattari, Sadie Plant's writings on cybernetics and feminism, Nick Land's "Fanged Noumena", and Reza Negarestani's "Cyclonopedia". The phrase should touch on themes like deterritorialization, the war machine, rhizomatic connections, petroleum, dust, or machinic desire. The output should be intense, abstract, and poetic. Use a newline character to separate the two lines.`;

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // This check is important for when the API call succeeds but returns an error object
        if (!response.ok) {
            console.error("Gemini API Error Response:", result);
            throw new Error(`API responded with status ${response.status}: ${result.error?.message || 'Unknown error'}`);
        }

        console.log("Gemini API Response:", result);

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            startTyping(result.candidates[0].content.parts[0].text);
        } else {
             // This case handles safety blocks or other reasons for an empty candidate list
            console.error("API response was empty, malformed, or content was blocked.", result);
            if(result.candidates && result.candidates[0] && result.candidates[0].safetyRatings) {
                 console.error("Safety Ratings:", result.candidates[0].safetyRatings);
            }
            startTyping("A BODY WITHOUT ORGANS<br>IS MADE OF SILICON AND DUST");
        }
    } catch (error) {
        // This will catch network errors (like CORS) or errors thrown from the try block
        console.error("Error calling Gemini API:", error);
        startTyping("DETERRITORIALIZE<br>THE DIGITAL FLOW");
    } finally {
        geminiButton.disabled = false;
        geminiButton.classList.remove('loading');
        isGenerating = false;
    }
}

function setup() {
    let canvasContainer = document.querySelector('.canvas-container');
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent(canvasContainer);

    textElement = document.getElementById('typing-text');
    geminiButton = document.getElementById('gemini-btn');
    geminiButton.addEventListener('click', generateNewText);

    colorMode(HSB, 360, 100, 100, 100);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    for (let i = 0; i < pointCount; i++) {
        const u = Math.random(), v = Math.random();
        const theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
        const x = baseSphereRadius * Math.sin(phi) * Math.cos(theta);
        const y = baseSphereRadius * Math.sin(phi) * Math.sin(theta);
        const z = baseSphereRadius * Math.cos(phi);
        points.push(createVector(x, y, z));
    }
}

function handleScroll() {
    const scrollMax = 500, fadeEnd = 300, scrollPos = window.scrollY;
    currentScale = map(scrollPos, 0, scrollMax, 1, 2.5, true);
    currentAlpha = map(scrollPos, 0, scrollMax, 100, 10, true);

    const elementOpacity = map(scrollPos, 0, fadeEnd, 1, 0, true);
    currentTextOpacity = elementOpacity;

    const buttonScrollRange = 400, initialButtonTopPercent = 80, finalButtonTopPercent = -10;
    const newButtonTop = map(scrollPos, 0, buttonScrollRange, initialButtonTopPercent, finalButtonTopPercent, true);
    geminiButton.style.top = `${newButtonTop}%`;
    geminiButton.style.opacity = elementOpacity;
    geminiButton.style.pointerEvents = elementOpacity < 0.1 ? 'none' : 'auto';

    const textScrollRange = 400, initialTextTopPercent = 50, finalTextTopPercent = 10;
    const newTextTop = map(scrollPos, 0, textScrollRange, initialTextTopPercent, finalTextTopPercent, true);
    textElement.style.top = `${newTextTop}%`;
}

function draw() {
    if (frameCount % 5 === 0 && typeIndex < fullText.length) {
        if (fullText.substring(typeIndex, typeIndex + 4) === '<br>') {
            typedText += '<br>';
            typeIndex += 4;
        } else {
            typedText += fullText.charAt(typeIndex);
            typeIndex++;
        }
    }
    textElement.innerHTML = typedText + '<span class="cursor">_</span>';
    textElement.style.opacity = currentTextOpacity;

    push();
    noStroke();
    fill(0, 0, 0, 15);
    translate(0, 0, -max(width, height));
    plane(width * 4, height * 4);
    pop();

    if (!isDragging && !isGenerating) rotY += autoRotationSpeed;

    push();
    translate(width / 4, 0, 0);
    rotateX(rotX);
    rotateY(rotY);
    scale(currentScale);

    strokeWeight(3);
    const timeHueOffset = frameCount * 0.5;

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (isGenerating) {
            stroke(0, 0, 100, currentAlpha);
            const jitter = p5.Vector.random3D().mult(5);
            point(p.x + jitter.x, p.y + jitter.y, p.z + jitter.z);
        } else {
            const baseHue = map(p.y, -baseSphereRadius, baseSphereRadius, 180, 360);
            const finalHue = (baseHue + timeHueOffset) % 360;
            stroke(finalHue, 90, 100, currentAlpha);
            point(p.x, p.y, p.z);
        }
    }
    pop();
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) isDragging = true;
}

function mouseReleased() {
    isDragging = false;
}

function mouseDragged() {
    if (isDragging) {
        rotY += (mouseX - pmouseX) * userRotationSpeed;
        rotX -= (mouseY - pmouseY) * userRotationSpeed;
    }
}

document.oncontextmenu = () => false;

function windowResized() {
     resizeCanvas(windowWidth, windowHeight);
}
