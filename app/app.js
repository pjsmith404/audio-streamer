const CONTENT_ROOT = "http://localhost:8080/content/"
let currentPath = CONTENT_ROOT;

document.addEventListener('DOMContentLoaded', async () => {
	document.getElementById('file-list').innerHTML = await getData(CONTENT_ROOT);
});

const fileList = document.getElementById('file-list');
fileList.addEventListener('click', loadFileList);

const songQueue = document.getElementById("song-queue");

const audioPlayer = document.getElementById('audio-player');

async function loadFileList(event) {
	event.preventDefault();

	const targetLink = event.target.closest('a');
	const targetPath = targetLink.getAttribute('href');
	const nextPath = currentPath + targetPath;

	const newHtml = await getData(nextPath);
	const parser = new DOMParser();
	const newDoc = parser.parseFromString(newHtml, 'text/html');
	console.log(newDoc.body.children);

	const modDoc = `<pre><a href="../">..</a></pre>` + newDoc.body.innerHTML;

	document.getElementById('file-list').innerHTML = modDoc;

	currentPath = nextPath;
}

async function getData(targetUrl) {
	const response = await fetch(targetUrl);
	console.log(response);
	const contentType = response.headers.get("content-type");
	console.log(contentType);
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

