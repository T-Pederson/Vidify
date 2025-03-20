# Vidify
Plays YouTube videos of your Spotify playlists.

### Notes:
- Initial page prompts user for their Spotify username
    - Cache this in local storage so when user re-visits site they don't have to re-enter their username
- Playlist page shows a list of all users Spotify playlists
    - Cache this list of user playlists for 1 hour
- Clicking a playlist shows a list of all the playlist's songs
    - Cache this list of playlist songs for 1 hour, reloaded at the same time a user playlist is reloaded
- Video player page automatically starts playing the first video in the playlist
- There will be a shuffle button and a next button, play/pause will be handled in youtube player
    - Turning the shuffle button off and on resets the shuffled state - reflected in song list window
    - Shuffling will entail restarting the playlist from the beginning but in a shuffled state
    - Need to ensure the playlist is actually reshuffled when button is toggled
- When a song is played, search for the video on youtube by "{artistName} {songName}" and just play the first result
    - Cache song video results, especially important for Youtube's api since the quota is pretty limited. May as well just cache these indefinitely
    - Give a user the next 5 top results as alternative videos if the video isn't what the user was looking for
        - If a user does select an alternative video, repopulate the list of alternative videos by removing the selected vid and adding in the vid that was playing previously
        - Ex. 1 playing, 2-6 in alt window. If 4 is selected, 1-3 and 5-6 are now shown in alt window.
- When a video is done automatically start the next song
    - Need to figure out how to recognize when a video is done as well as how to automatically start the next loaded vid
- Since Youtube only allows 100 calls/day, may need to come up with an alternative solution to finding youtube vid ids, perhaps a web scraper?
    - Will this be in the backend app itself, or a separate microservice, perhaps Python?

### TODOs:
- Create React/Vite frontend
    - Initial page asks for username
    - Playlists page shows playlists with playlist images and a refresh playlists button
    - Video page shows songs, shuffle and prev/next buttons, video player, back/home button, refresh playlist button
- Create Express backend that calls Spotify/Youtube Apis and caches results
    - Frontend will only make calls to this backend and not external APIs, keeps the api keys secure as well
- Create PostgreSQL DB for caching results
    - Can I store string arrays in PostgreSQL? If not, is MongoDB a better solution?
    - Songs never get deleted even if they're not associated with a playlist anymore (i.e. a playlist is deleted)
    - Playlists
        - id - can use spotify id
        - expires (default 1 hour cache duration, triggers rework of PlaylistSongs table)
        - name
        - playlistImage
    - Songs
        - id - can use spotify id
        - songName
        - artistName
        - albumName
        - duration
        - albumArt
        - youtubeVidId (doesn't reset since Youtube Api is stingy)
        - altYoutubeVidIds (results 2-6 from search)
    - YoutubeVideo
        - id - can use youtube id
        - title
        - thumbnail
    - Users
        - id
        - spotifyUsername
    - UserPlaylists
        - userId
        - playlistId
    - PlaylistSongs
        - playlistId
        - songId

### MVP:
- Frontend
    - Initial page asking for username
    - Playlist page showing users playlists - no caching logic
    - Video page showing only Artist - Song - Duration, video player, and link back to home page, no autoplay or autonext logic, next/prev/shuffle buttons there but not working
- Backend
    - Endpoint to fetch Playlists
        - Calls spotify api, caches playlist info, returns playlist info, no cache expiry logic
    - Endpoint to fetch Playlist Songs
        - Calls Spotify api, caches song info, returns songs info, no cache expiry logic
    - Endpoint to fetch Youtube Video
        - Calls Youtube api, caches top 6 video ids, returns video id
        - Alternatively, a web scaper that searches youtube and parses top 6 vid results