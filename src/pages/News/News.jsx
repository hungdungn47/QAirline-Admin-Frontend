import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import axios from "axios";
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

const News = () => {
  const [newsList, setNewsList] = useState([]);
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

  useEffect(() => {
    fetchNews();
    fetchNewsFolderList();
    fetchNewsClassificationList();
  }, []);

  const fetchNews = async () => {
    const newsData = await fetchNewsApi(); // Fetching from fake API
    setNewsList(newsData);
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
          setNewsList((prev) =>
            prev.map((news) =>
              news.id === currentNews.id ? { ...currentNews } : news
            )
          );
          toast.success("res");
        })
        .catch((error) => {
          toast.error(error.response.data);
        });
    } else {
      console.log("Creating news: ", currentNews);
      delete currentNews.id;
      createNews(currentNews)
        .then((res) => {
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
        setNewsList((prev) => prev.filter((news) => news.id !== id));
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
      {/* <TableContainer
        component={Paper}
        style={{
          marginTop: "20px",
          boxShadow: "0 0px 5px rgb(0, 0, 0, 0.3)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Folder</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Classification</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newsList.map((news) => (
              <TableRow key={news.id}>
                <TableCell>{news.title}</TableCell>
                <TableCell>
                  {news.content.length > 100 ? (
                    <ContentCell content={news.content} />
                  ) : (
                    news.content.split("\n").map((line, index) => {
                      return <p key={index}>{line}</p>;
                    })
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    wordBreak: "keep-all",
                    overflowWrap: "normal",
                    whiteSpace: "nowrap",
                  }}
                >
                  {news.folder}
                </TableCell>
                <TableCell>
                  <img
                    src={news.imageUrl}
                    style={{
                      height: "150px",
                      width: "250px",
                      objectFit: "contain",
                    }}
                  />
                </TableCell>
                <TableCell>{news.classification}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenDialog(news)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteNews(news.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
      <div className="mt-3 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {newsList.map((news) => (
          <NewsComponent key={news.id} news={news} />
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
            value={folderInput}
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
            value={classificationInput}
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
