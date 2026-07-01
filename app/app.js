const url = new URL(document.URL);
const CONTENT_ROOT = `${url.origin}/content/`;
let currentPath = CONTENT_ROOT;

document.addEventListener('DOMContentLoaded', async () => {
	const response = await fetch(CONTENT_ROOT);
	const text = await response.text();
	document.getElementById('file-list').innerHTML = text;
});

const fileList = document.getElementById('file-list');
fileList.addEventListener('click', fileListHandler);

const songQueueElement = document.getElementById("song-queue");

const songQueue = [];
let nowPlaying = undefined;

const audioPlayerDiv = document.getElementById('audio-player');
const audioPlayer = new Audio();
audioPlayer.controls = true;
audioPlayerDiv.append(audioPlayer);
audioPlayer.addEventListener('ended', async function(event) {
	console.log(event);
	if (songQueue.length === 0) {
		console.log("No songs queued");
		return;
	}

	const targetPlayer = event.target;
	playNextSong(targetPlayer);
});

const nowPlayingDiv = document.getElementById('now-playing');
const nowPlayingHeading = document.createElement('h1');
nowPlayingHeading.append('Now Playing');
const nowPlayingDisplay = document.createElement('p');

nowPlayingDiv.append(nowPlayingHeading);
nowPlayingDiv.append(nowPlayingDisplay);

async function playNextSong(audioPlayer) {
	nextSong = songQueue[0];

	if (!nextSong) {
		return;
	}

	audioPlayer.src = songQueue[0];
	audioPlayer.play();

	songQueue.shift();
	updateSongQueue();

	nowPlayingDisplay.replaceChildren(nextSong);
	nowPlaying = nextSong;
}

async function fileListHandler(event) {
	event.preventDefault();

	const targetLink = event.target.closest('a');
	const targetPath = targetLink.getAttribute('href');
	const targetUrl = currentPath + targetPath;

	const response = await fetch(targetUrl);
	const contentType = response.headers.get("content-type");

	if (contentType.includes('text/html')) {
		const newHtml = await response.text();
		updateFileList(newHtml);
		currentPath = targetUrl;
	}

	if (contentType.includes('audio/')) {
		queueSong(targetUrl);
	}
}

async function updateFileList(data) {
	const parser = new DOMParser();
	const newDoc = parser.parseFromString(data, 'text/html');

	// TODO: Something about this path traversal, it's awful.
	const modDoc = `<pre><a href="../">..</a></pre>` + newDoc.body.innerHTML;

	document.getElementById('file-list').innerHTML = modDoc;
}

async function queueSong(song) {
	songQueue.push(song);

	if (!nowPlaying && songQueue.length === 1) {
		playNextSong(audioPlayer);
	}

	updateSongQueue();
}

async function updateSongQueue() {
	const newChildren = songQueue.map((song) => {
		const li = document.createElement('li');
		li.append(song);
		return li;
	});

	songQueueElement.replaceChildren(...newChildren);
}

