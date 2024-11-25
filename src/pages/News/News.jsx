import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
import { fetchNewsApi } from "../../apis/api";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentNews, setCurrentNews] = useState({
    id: null,
    title: "",
    content: "",
    category: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const response = await fetchNewsApi(); // Fetching from fake API
    setNewsList(response);
  };

  const validateForm = () => {
    const { title, content, category } = currentNews;
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!content.trim()) newErrors.content = "Content is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (
    news = { id: null, title: "", content: "", category: "" }
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
      // Update existing news
      // await axios.put(`http://localhost:3001/news/${currentNews.id}`, currentNews);
      setNewsList((prev) =>
        prev.map((news) =>
          news.id === currentNews.id ? { ...currentNews } : news
        )
      );
    } else {
      // Add new news
      // await axios.post("http://localhost:3001/news", currentNews);
      const newId = newsList.length ? newsList[newsList.length - 1].id + 1 : 1;
      setNewsList((prev) => [...prev, { ...currentNews, id: newId }]);
    }
    // fetchNews();
    handleCloseDialog();
  };

  const handleDeleteNews = async (id) => {
    // await axios.delete(`http://localhost:3001/news/${id}`);
    setNewsList((prev) => prev.filter((news) => news.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentNews((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>News Management</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Add News
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newsList.map((news) => (
              <TableRow key={news.id}>
                <TableCell>{news.title}</TableCell>
                <TableCell>{news.content}</TableCell>
                <TableCell>{news.category}</TableCell>
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
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
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
            label="Content"
            name="content"
            value={currentNews.content}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={!!errors.content}
            helperText={errors.content}
          />
          <Select
            name="category"
            value={currentNews.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
            displayEmpty
            error={!!errors.category}
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            <MenuItem value="Travel Updates">Travel Updates</MenuItem>
            <MenuItem value="Advisory">Advisory</MenuItem>
            <MenuItem value="Announcements">Announcements</MenuItem>
            <MenuItem value="Recognition">Recognition</MenuItem>
            <MenuItem value="Sustainability">Sustainability</MenuItem>
          </Select>
          {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
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

export default News;
