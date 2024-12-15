import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createNews,
  deleteNews,
  fetchNewsApi,
  getAllNewsClassification,
  getAllNewsFolder,
  updateNews,
} from "../../apis/api";
import NewsComponent from "../../components/News/NewsComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  newsAdded,
  newsDeleted,
  newsFetched,
  newsUpdated,
} from "../../app/newsSlice";
import { v4 as uuidv4 } from "uuid";

const News = () => {
  const newsList = useSelector((state) => state.news);
  const [openDialog, setOpenDialog] = useState(false);
  const [folderList, setFolderList] = useState([]);
  const [classificationList, setClassficationList] = useState([]);
  const [currentNews, setCurrentNews] = useState({
    id: null,
    imageUrl: "",
    title: "",
    content: "",
    folder: "",
    classification: "",
  });
  const [errors, setErrors] = useState({});
  const [folderInput, setFolderInput] = useState(currentNews.folder || "");
  const [classificationInput, setClassificationInput] = useState(
    currentNews.classification || ""
  );

  const dispatch = useDispatch();

  useEffect(() => {
    fetchNews();
    fetchNewsFolderList();
    fetchNewsClassificationList();
  }, []);

  const fetchNews = async () => {
    const newsData = await fetchNewsApi();
    dispatch(newsFetched(newsData));
  };

  const fetchNewsFolderList = async () => {
    const res = await getAllNewsFolder();
    setFolderList(res);
  };

  const fetchNewsClassificationList = async () => {
    const res = await getAllNewsClassification();
    setClassficationList(res);
  };

  const validateForm = () => {
    const { title, content, folder } = currentNews;
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!content.trim()) newErrors.content = "Content is required.";
    if (!folder.trim()) newErrors.folder = "Folder is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (
    news = {
      id: null,
      title: "",
      imageUrl: "",
      content: "",
      folder: "",
      classification: "",
    }
  ) => {
    setCurrentNews(news);
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveNews = async () => {
    if (!validateForm()) return;

    if (currentNews.id) {
      delete currentNews.createdAdmin;
      delete currentNews.createdTime;
      updateNews(currentNews)
        .then((res) => {
          dispatch(newsUpdated(currentNews));
          toast.success(res);
        })
        .catch((error) => {
          toast.error(error.response.data);
        });
    } else {
      console.log("Creating news: ", currentNews);
      delete currentNews.id;
      createNews(currentNews)
        .then((res) => {
          const tempId = uuidv4();
          dispatch(newsAdded({ ...currentNews, id: tempId }));
          fetchNews();
          fetchNewsFolderList();
          fetchNewsClassificationList();
          toast.success(res);
        })
        .catch((error) => {
          toast.error(error.response.data);
        });
    }
    handleCloseDialog();
  };

  const handleDeleteNews = async (id) => {
    deleteNews(id)
      .then((res) => {
        // setNewsList((prev) => prev.filter((news) => news.id !== id));
        dispatch(newsDeleted(id));
        toast.success(res);
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentNews((prev) => ({ ...prev, [name]: value }));
  };

  if (newsList.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading news...</Typography>
      </Box>
    );
  }

  return (
    <div className="m-5">
      <ToastContainer />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Add News
      </Button>

      <div className="mt-3 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {newsList.map((news) => (
          <NewsComponent
            key={news.id}
            news={news}
            handleOpenDialog={handleOpenDialog}
            handleDeleteNews={handleDeleteNews}
          />
        ))}
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullScreen>
        <DialogTitle>{currentNews.id ? "Edit News" : "Add News"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={currentNews.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={currentNews.imageUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.imageUrl}
            helperText={errors.imageUrl}
          />
          <TextField
            label="Content"
            name="content"
            value={currentNews.content}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={12}
            error={!!errors.content}
            helperText={errors.content}
          />
          <Autocomplete
            freeSolo
            options={folderList}
            value={currentNews.folder}
            onChange={(event, newValue) => {
              setFolderInput(newValue || ""); // Handle selection
              handleChange({
                target: { name: "folder", value: newValue || "" },
              }); // Trigger onChange
            }}
            inputValue={folderInput}
            onInputChange={(event, newInputValue) => {
              setFolderInput(newInputValue); // Handle typing
              handleChange({
                target: { name: "folder", value: newInputValue },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Folder"
                sx={{ marginTop: "1rem" }}
                fullWidth
                error={!!errors.folder}
                helperText={errors.folder}
              />
            )}
          />

          {/* Classification Dropdown */}
          <Autocomplete
            freeSolo
            options={classificationList}
            value={currentNews.classification}
            onChange={(event, newValue) => {
              setClassificationInput(newValue || "");
              handleChange({
                target: { name: "classification", value: newValue || "" },
              });
            }}
            inputValue={classificationInput}
            onInputChange={(event, newInputValue) => {
              setClassificationInput(newInputValue);
              handleChange({
                target: { name: "classification", value: newInputValue },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Classification"
                sx={{ marginTop: "1rem" }}
                fullWidth
                error={!!errors.classification}
                helperText={errors.classification}
              />
            )}
          />
          {errors.folder && <p style={{ color: "red" }}>{errors.folder}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveNews} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function ContentCell({ content }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col items-end">
      <div className="block">
        {isExpanded ? content : `${content.slice(0, 200)}...`}
      </div>
      <div
        onClick={toggleExpanded}
        className="text-blue-500 hover:underline mt-2 cursor-pointer"
      >
        {isExpanded ? "See less" : "See more"}
      </div>
    </div>
  );
}

export default News;
