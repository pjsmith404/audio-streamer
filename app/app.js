const CONTENT_ROOT = "../content/"
let currentPath = CONTENT_ROOT;

document.addEventListener('DOMContentLoaded', async () => {
	document.getElementById('file-list').innerHTML = await getData(CONTENT_ROOT);
});

document.getElementById('file-list').addEventListener('click', async function(event) {
	event.preventDefault();

	const targetLink = event.target.closest('a');
	console.log(targetLink);
	const targetPath = targetLink.getAttribute('href');
	const newPath = currentPath + targetPath;
	console.log(newPath);
	console.log(currentPath);

	const newHtml = await getData(newPath);

	const parser = new DOMParser();
	const newDoc = parser.parseFromString(newHtml, 'text/html');
	const modDoc = newDoc.body.innerHTML + `<pre><a href="../">..</a></pre>`;

	document.getElementById('file-list').innerHTML = modDoc;

	currentPath = newPath;
	currentPath = trimPath(currentPath);
});

async function getData(targetUrl) {
	const response = await fetch(targetUrl);
	text = await response.text();
	return text;
};

function trimPath(path) {
	splitPath = path.split('/');
	if (splitPath.slice(-1) === '..') {
		splitPath.pop()
		splitPath.pop()
		const trimmedPath = splitPath.join('/');

		const finalPath = trimmedPath + '/';

		return finalPath;
	} else {
		return path;
	}
}

