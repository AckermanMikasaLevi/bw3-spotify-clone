function searchArtist() {
    const query = document.querySelector('.search-bar').value.trim();
    
    if (query) {
        fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`)
            .then(response => response.json())
            .then(data => displaySearchResults(data.data))
            .catch(error => console.error('Errore nella ricerca:', error));
    } else {
        alert("Inserisci un termine di ricerca");
    }
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Nessun risultato trovato.</p>';
        return;
    }

    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result-item');

        resultDiv.innerHTML = `
            <img src="${result.album.cover_medium}" alt="${result.title}">
            <div class="result-info">
                <h3>${result.artist.name}</h3>
                <p>${result.title}</p>
            </div>
        `;

        resultDiv.onclick = () => {
            window.location.href = `artist.html?id=${result.artist.id}`;
        };

        resultsContainer.appendChild(resultDiv);
    });
}

document.querySelector('.search-bar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchArtist(); 
    }
});

function loadArtistDetails() {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get('id');

    if (artistId) {
        fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('artist-name').textContent = data.name;
                document.getElementById('monthly-listeners').textContent = `${data.nb_fan.toLocaleString()} ascoltatori mensili`;
                document.getElementById('artist-image').src = data.picture_big;
                document.getElementById('artist-name-mini').textContent = data.name;

                loadAlbums(artistId);  
                loadPopularSongs(artistId);
            })
            .catch(error => console.error('Errore nel caricamento dei dettagli dell\'artista:', error));
    }
}

function loadAlbums(artistId) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/albums`)
        .then(response => response.json())
        .then(albums => {
            const albumsList = document.getElementById('albums-list');
            albumsList.innerHTML = '';

            albums.data.forEach(album => {
                const albumDiv = document.createElement('div');
                albumDiv.classList.add('album-item');

                albumDiv.innerHTML = `
                    <img src="${album.cover_big}" alt="${album.title}" class="album-image">
                    <h3>${album.title}</h3>
                    <button onclick="loadAlbumTracks(${album.id})">Visualizza Tracce</button>
                `;

                albumsList.appendChild(albumDiv);
            });
        })
        .catch(error => console.error('Errore nel caricamento degli album:', error));
}

function loadAlbumTracks(albumId) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`)
        .then(response => response.json())
        .then(albumData => {
            const trackList = document.getElementById('track-list');
            trackList.innerHTML = '';

            albumData.tracks.data.forEach((track, index) => {
                const trackDiv = document.createElement('li');
                trackDiv.innerHTML = `
                    ${index + 1}. ${track.title} - ${track.artist.name}
                `;
                trackList.appendChild(trackDiv);
            });
        })
        .catch(error => console.error('Errore nel caricamento delle tracce dell\'album:', error));
}

if (window.location.pathname.includes('artist.html')) {
    loadArtistDetails();
}
