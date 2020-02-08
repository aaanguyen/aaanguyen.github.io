// Get the hash of the url
const hash = window.location.hash.substring(1).split('&').reduce(function(initial, item) {
    if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'f3999b83b2cb4c2e8256b0e5ae2c48bd';
const redirectUri = 'https://aaanguyen.github.io/spotifyStats.html';
const scopes = [
    'user-top-read'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
        '%20'
    )}&response_type=token`;
}

const types = [
    'artists',
    'tracks'
];
const time_ranges = [
    'short_term',
    'medium_term',
    'long_term'
];
const topTracks = `https://api.spotify.com/v1/me/top/`;

const headers = {
    Accept         : 'application/json',
    'Content-Type' : 'application/json',
    Authorization  : 'Bearer ' + _token
};

async function populate() {
    for (time_range of time_ranges) {
        for (type of types) {
            const query = `${type}?time_range=${time_range}&limit=50`;
            const obj = await axios.get(topTracks + query, { headers });
            const o_list = document.createElement('ol');
            if (type === 'tracks') {
                obj.data.items.forEach(function(track, idx) {
                    const li = document.createElement('li');
                    if (idx % 2 === 1) {
                        li.style.backgroundColor = '#222222';
                    } else {
                        li.style.backgroundColor = '#000000';
                    }
                    li.innerHTML = `<img src="${track.album.images[1].url}" class="track-img">  <span>${track.artists[0]
                        .name} - ${track.name}</span>`;
                    o_list.appendChild(li);
                });
            } else {
                obj.data.items.forEach(function(artist, idx) {
                    // const lastImgIdx = artist.images.length - 1;
                    const li = document.createElement('li');
                    if (idx % 2 === 1) {
                        li.style.backgroundColor = '#222222';
                    } else {
                        li.style.backgroundColor = '#000000';
                    }
                    li.innerHTML = `<img src="${artist.images[1]
                        .url}" class="artist-img">  <span>${artist.name}</span>`;

                    o_list.appendChild(li);
                    console.log(li);
                });
            }
            document.querySelector(`#${time_range}_${type}`).appendChild(o_list);
        }
    }
}

populate();
