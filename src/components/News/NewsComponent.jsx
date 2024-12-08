import { Button } from "@mui/material";

export default function NewsComponent({
  news,
  handleOpenDialog,
  handleDeleteNews,
}) {
  return (
    <div className="flex shadow-[0_0_5px_rgba(0,0,0,0.3)] gap-2 rounded-md mb-2 min-h-[8rem]">
      <img
        src={news.imageUrl}
        className="rounded-md w-[30%] h-[100%] object-contain"
      />
      <div className="flex flex-col justify-between p-2">
        <div>
          <div className="text-theme-primary font-bold">{news.title}</div>
          <div className="text-gray-400 text-xs">
            {news.classification} / {news.folder}
          </div>
        </div>
        <div className="text-sm">{`${news.content.slice(0, 100)}...`}</div>
        <div className="flex gap-1">
          <button
            onClick={() => handleOpenDialog(news)}
            className="rounded-sm border-[0.5px] py-1 border-solid border-[#69548D] flex-1 text-sm text-theme-primary"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteNews(news.id)}
            className="rounded-sm border-[0.5px] py-1 border-solid border-[#ff0000] flex-1 text-sm text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
