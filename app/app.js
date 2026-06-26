const CONTENT_ROOT = "http://localhost:8080/content/"
let currentPath = CONTENT_ROOT;

document.addEventListener('DOMContentLoaded', async () => {
	document.getElementById('file-list').innerHTML = await getData(CONTENT_ROOT);
});

const fileList = document.getElementById('file-list');
fileList.addEventListener('click', fileListHandler);

const songQueueElement = document.getElementById("song-queue");

const songQueue = [];

const audioPlayer = document.getElementById('audio-player');

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
	const li = document.createElement('li');
	li.append(song);
	songQueueElement.appendChild(li);
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

function trimPath(path) {
	const splitPath = path.split('/');
	console.log(splitPath);
	splitPath.pop();
	console.log(splitPath);
	if (splitPath[-1] === '..') {
		splitPath.pop();
		splitPath.pop();
		console.log(splitPath);
		const trimmedPath = splitPath.join('/');

		const finalPath = trimmedPath + '/';

		return finalPath;
	} else {
		return path;
	}
}

