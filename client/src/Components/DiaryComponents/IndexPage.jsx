import { memo } from "react";

const IndexPage = memo(({ pages, currentPage, onPageSelect, onDelete }) => {
  const contentPages = pages.filter(page => !page.isCover && !page.isIndex);
  
  if (contentPages.length === 0) {
    return (
      <div className="text-center space-y-4 bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950 w-full h-full text-white pt-8 px-4 md:px-6">
        <h2 className="text-[1.2em] sm:text-[3vmin] font-bold mb-8">Table of Contents</h2>
        <p className="text-gray-300 text-sm md:text-base">No memories yet. Add your first memory!</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950 w-full h-full text-white pt-8 px-4 md:px-6">
      <h2 className="text-[1.2em] sm:text-[3vmin] font-bold mb-8">Table of Contents</h2>
      <div className="space-y-3 md:space-y-4">
        {contentPages.map((page) => (
          <div key={page.id} className="flex justify-between">
            <button
              onClick={() => onPageSelect(page.id)}
              className={`block w-full text-left px-3 md:px-4 py-2 rounded hover:bg-white/10 transition-colors text-sm md:text-base ${
                currentPage === page.id ? "bg-white/20" : ""
              }`}
            >
              {page.title}
            </button>
            <button
              className="rounded-e hover:bg-white/10 transition-colors rounded-s-none -translate-x-1 p-2 text-red-500"
              onClick={() => onDelete(page.id)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

export default IndexPage;