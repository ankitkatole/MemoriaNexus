import { useState, memo } from "react";
import { PenSquare, TableProperties } from "lucide-react";
import cover from "../../assets/LogoTransparent.svg";

const Page = memo(({ page, onEdit, jumpToIndex }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(page.title);

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    onEdit({ ...page, title: editedTitle });
  };

  if (page.isCover) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950 flex flex-col items-center gap-8 md:gap-16 justify-center text-white overflow-hidden relative">
        <img src={cover} alt="bg-img" className="object-cover w-16 h-16 md:w-20 md:h-20 z-0" />
        <div className="relative text-3xl md:text-5xl z-10 px-4 text-center">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSave}
              className="bg-transparent border-b-2 border-white text-center outline-none text-white w-full"
              autoFocus
            />
          ) : (
            <a onClick={handleTitleEdit} className="cursor-pointer">
              {page.title}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950 w-full h-full text-white pt-8 px-4 md:px-6 relative">
      <button 
        onClick={() => onEdit(page)}
        className="absolute top-4 right-4 p-1.5 md:p-2 box hover:bg-white/10 !rounded-full transition-colors"
      >
        <PenSquare className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <button 
        onClick={() => jumpToIndex(1)}
        className="absolute top-0 md:top-0 right-14 md:right-16 p-1.5 md:p-2 box hover:bg-white/10 !rounded-full transition-colors"
      >
        <TableProperties className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <h2 className="text-[1.2em] sm:text-[3vmin] font-bold">{page.title}</h2>
      <p className="text-gray-300 text-[0.8em] sm:text-[1.8vmin] whitespace-pre-wrap break-words">
        {page.content}
      </p>
    </div>
  );
});

export default Page;