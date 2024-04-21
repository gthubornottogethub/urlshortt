
//EL JAVASCRIPT ELLY BYHANDLE EL FRONTEND
async function shortenUrl(event) {
    event.preventDefault(); 
    const urlInput = document.getElementById("urlInput").value;
    try {
        const response = await fetch('/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: urlInput })
        });
        const data = await response.json();
        const shortenedUrlElement = document.getElementById("shortenedUrlDisplay");
        const shortenedUrlLink = document.createElement("a");
        shortenedUrlLink.href = `http://localhost:1337/${data.slug}`;
        shortenedUrlLink.textContent = `localhost:1337/${data.slug}`;
        shortenedUrlLink.style.color = "#8B0000"
        shortenedUrlLink.style.textDecoration = "none";
        shortenedUrlElement.textContent = "";
        shortenedUrlElement.appendChild(shortenedUrlLink);
        shortenedUrlElement.style.display = "block";
    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
}

document.getElementById("urlForm").addEventListener('submit', shortenUrl);

