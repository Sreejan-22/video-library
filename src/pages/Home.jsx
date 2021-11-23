import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout/Layout";
import VideoCard from "../components/VideoCard/VideoCard";
import { isAuthenticated, getUser } from "../utils/auth";
import "./Home.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [active, setActive] = useState("all");
  const [playlists, setPlaylists] = useState([]);
  const [isAddedToPlaylist, setIsAddedToPlaylist] = useState([]);
  const allVideos = useRef([]);
  const isAddedToPlaylistInitial = useRef([]);

  useEffect(() => {
    const url = isAuthenticated()
      ? `${main_url}/uservideos/${getUser().username}`
      : `${main_url}/videos`;

    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // console.log(data);
          allVideos.current = data.videos;
          isAddedToPlaylistInitial.current = data.isAdded;
          setVideos(data.videos);
          setPlaylists(data.playlists);
          setIsAddedToPlaylist(data.isAdded);
        } else {
          console.log(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <>
        {loading ? (
          <div className="loader-container">
            <h1>Loading...</h1>
          </div>
        ) : (
          <>
            <div className="wrapper">
              <div className="blank-space"></div>
              <div className="tags-container">
                <div
                  className={`tag ${active === "all" ? "active-tag" : ""}`}
                  onClick={() => {
                    setActive("all");
                    setVideos(allVideos.current);
                    setIsAddedToPlaylist(isAddedToPlaylistInitial.current);
                  }}
                  style={{ borderRadius: "16px" }}
                >
                  All
                </div>
                <div
                  className={`tag ${
                    active === "highlights" ? "active-tag" : ""
                  }`}
                  onClick={() => {
                    setActive("highlights");
                    // const temp = allVideos.current.filter(
                    //   (item) => item.category === "highlights"
                    // );
                    let temp = [];
                    let flag = [];
                    allVideos.current.forEach((item, index) => {
                      if (item.category === "highlights") {
                        temp.push(item);
                        flag.push(isAddedToPlaylist[index]);
                      }
                    });
                    setVideos(temp);
                    setIsAddedToPlaylist(flag);
                  }}
                >
                  Highlights
                </div>
                <div
                  className={`tag ${
                    active === "tutorials" ? "active-tag" : ""
                  }`}
                  onClick={() => {
                    setActive("tutorials");
                    // const temp = allVideos.current.filter(
                    //   (item) => item.category === "tutorials"
                    // );
                    // setVideos(temp);
                    let temp = [];
                    let flag = [];
                    allVideos.current.forEach((item, index) => {
                      if (item.category === "tutorials") {
                        temp.push(item);
                        flag.push(isAddedToPlaylist[index]);
                      }
                    });
                    setVideos(temp);
                    setIsAddedToPlaylist(flag);
                  }}
                >
                  Tutorials
                </div>
                <div
                  className={`tag ${
                    active === "performances" ? "active-tag" : ""
                  }`}
                  onClick={() => {
                    setActive("performances");
                    // const temp = allVideos.current.filter(
                    //   (item) => item.category === "performances"
                    // );
                    // setVideos(temp);
                    let temp = [];
                    let flag = [];
                    allVideos.current.forEach((item, index) => {
                      if (item.category === "performances") {
                        temp.push(item);
                        flag.push(isAddedToPlaylist[index]);
                      }
                    });
                    setVideos(temp);
                    setIsAddedToPlaylist(flag);
                  }}
                >
                  Best Performances
                </div>
              </div>
              <div className="video-container">
                {videos.map((item, index) => (
                  <VideoCard
                    item={item}
                    playlists={playlists}
                    isAdded={isAddedToPlaylist[index]}
                    key={item._id}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default Home;
