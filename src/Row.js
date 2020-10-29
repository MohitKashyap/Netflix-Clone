import React, { useState, useEffect } from 'react'
import axios from './axios';
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseImageUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            // console.table(request.data.results);
            setMovies(request.data.results)
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1
        }
    }
    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || "")
                .then((url) => {
                    const urlParam = new URLSearchParams(new URL(url).search);
                    const trailer=urlParam.get('v');
                    setTrailerUrl(trailer);
                }).catch((error) => console.log(error));
        }
    }
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
                {movies.map((movie) => {
                    return <img className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        src={`${baseImageUrl}${
                            isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name} />;
                })}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
