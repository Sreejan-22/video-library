import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  videoSelector,
  setVideos,
  setUserData,
} from "../../slices/video.slice";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import { GoSearch } from "react-icons/go";
import "./Search.css";
import { isAuthenticated, getUser } from "../../utils/auth";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [searchquery, setSearchquery] = useState("");
  const dispatch = useDispatch();
  const { currVideos } = useSelector(videoSelector);
  const toast = useToast();

  const showToast = (title) => {
    toast({
      title,
      status: "error",
      duration: 4000,
      position: "top-right",
      isClosable: true,
    });
  };

  const search = async (query) => {
    try {
      const url = isAuthenticated()
        ? `${main_url}/searchuservideos?query=${query}`
        : `${main_url}/search?query=${query}`;

      const headers = isAuthenticated()
        ? {
            "Content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          }
        : {};

      setLoading(true);
      const res = await fetch(url, { headers: headers });
      const data = await res.json();
      if (data.success) {
        dispatch(
          setUserData({ videos: data.videos, playlists: data.playlists })
        );
        setLoading(false);
      } else {
        setLoading(false);
        showToast(data.message);
      }
    } catch (err) {
      setLoading(false);
      showToast("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="search-container">
        <div className="search-section">
          <div className="search-wrapper">
            <InputGroup size="md">
              <Input
                placeholder="Search"
                color="white"
                focusBorderColor="none"
                onChange={(e) => setSearchquery(e.target.value)}
              />
              <InputRightAddon
                children={<GoSearch />}
                cursor="pointer"
                onClick={() => {
                  if (searchquery.length) {
                    search(searchquery);
                  }
                }}
              />
            </InputGroup>
          </div>
        </div>
        <br />
        <br />
        {/* <div className="searched-videos"></div> */}
        {loading ? (
          <h1
            style={{ color: "white", fontSize: "1.2rem", textAlign: "center" }}
          >
            Loading search results...
          </h1>
        ) : currVideos.length ? (
          <div className="video-container">
            {currVideos.map((item) => (
              <VideoCard video={item} key={item._id} showToast={showToast} />
            ))}
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Search;
