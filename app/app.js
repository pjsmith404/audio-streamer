const CONTENT_ROOT = "http://localhost:8080/content/"
let currentPath = CONTENT_ROOT;

document.addEventListener('DOMContentLoaded', async () => {
	document.getElementById('file-list').innerHTML = await getData(CONTENT_ROOT);
});

const fileList = document.getElementById('file-list');
fileList.addEventListener('click', fileListHandler);

const songQueueElement = document.getElementById("song-queue");

const songQueue = [];

const audioPlayerDiv = document.getElementById('audio-player');
const audioPlayer = new Audio();
audioPlayer.controls = true;
audioPlayerDiv.append(audioPlayer);
audioPlayer.addEventListener('ended', enqueueSong);

async function enqueueSong(event) {
	const playingSong = event.srcElement.src;

	if (playingSong === songQueue[0]) {
		songQueue.shift();
	}

	updateSongQueue();

	if (songQueue.length === 0) {
		console.log("No songs queued");
		event.target.src = null;
		return;
	}

	event.target.src = songQueue[0];
	event.target.play();
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
	if (songQueue.length === 0) {
		audioPlayer.src = song;
		audioPlayer.play();
	}

	songQueue.push(song);

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

async function getData(targetUrl) {
	const response = await fetch(targetUrl);
	const contentType = response.headers.get("content-type");
	if (contentType.includes('text/html')) {
		text = await response.text();
		return text;
	}

	return 'Boooooo';
}

