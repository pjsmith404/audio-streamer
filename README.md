# Audio Streamer

A minimalist service for streaming audio from a file structure accessible to the web server. 

Streaming services do way more bullshit than I want and artists make fuck all money. This lets me to serve up all the music I've accumulated over the years on my local network and just listen from whatever device in a browser. I can buy direct at shows or from somewhere like bandcamp, rip it onto my NAS, and organise things however I please. And nothing is trying to flog AI whilst I do it.

It's made up of the following components:
- A section to navigate the folder structure
- Now playing
- A playlist of queued songs
- An audio player

## Usage

```shell
CONTENT_PATH='./path/to/content' go run .
```

