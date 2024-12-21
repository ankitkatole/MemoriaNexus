import { memo, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { PenSquare,TableProperties } from "lucide-react";
import arrow from "../../assets/Arrow.svg";
import cover from "../../assets/LogoTransparent.svg";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
// import Navbar from "../../Components/SharedComponents/Navbar";
// import Sidebar from "../../Components/SharedComponents/Sidebar";

const initialPages = [
  {
    id: 0,
    title: "Memoria Diary",
    content: "",
    isCover: true
  },
  {
    id: 1,
    title: "Table Of Content",
    content: "",
    isIndex: true,
  },
  {
    id: 2,
    title: "My First Memory",
    content: "Write your precious memory here..."
  },
  {
    id: 3,
    title: "Another Beautiful Day",
    content: "Capture the moments that matter..."
  }
];

const Page = memo(({ page, onEdit, JumpToindex }) => {
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
        onClick={() => JumpToindex(1)}
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
  
  const Index = memo(({ pages, currentPage, onPageSelect, onDelete }) => {
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

const EditDialog = memo(({ page, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (page && isOpen) {
      setTitle(page.title);
      setContent(page.content);
    }
  }, [page, isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ ...page, title: title.trim(), content: content.trim() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-cyan-300 p-6 rounded-lg w-full max-w-lg mx-4">
        <h2 className="text-xl text-white mb-4">{page.isCover ? 'Edit Diary Title' : 'Edit Memory'}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Memory Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
          {!page.isCover && (
            <textarea
              placeholder="Write your memory here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 min-h-[200px]"
            />
          )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded box2 bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

const cardVariants = {
  read: {
    rotateY: -180,
  },
  notRead: {
    rotateY: 0,
  },
};

const Diary = memo(() => {

   const navigate = useNavigate();
    
        useEffect(() => {
          const loginTokenCookie = Cookies.get('LoginStatus');
          if (!loginTokenCookie) {
            navigate('/'); 
          }
        }, [navigate]);


  const [pages, setPages] = useState(initialPages);
  const [zIndices, setZIndices] = useState([]);
  const [numberOfPagesRead, setNumberOfPagesRead] = useState(0);
  const [editingPage, setEditingPage] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = useCallback((page) => {
    setEditingPage(page);
    setShowEditDialog(true);
  }, []);

  const handleSave = useCallback((updatedPage) => {
    setPages(prevPages => 
      prevPages.map(p => p.id === updatedPage.id ? { ...p, ...updatedPage } : p)
    );
  }, []);

  const handleDelete = useCallback((pageId) => {
    setPages(prevPages => {
      const newPages = prevPages.filter(page => page.id !== pageId);
      // Adjust currentPage if necessary
      if (numberOfPagesRead >= newPages.length) {
        setNumberOfPagesRead(Math.max(0, newPages.length - 1));
      }
      return newPages;
    });
  }, [numberOfPagesRead]);

  const addNewPage = useCallback(() => {
    setPages(prevPages => {
      const maxId = Math.max(...prevPages.map(p => p.id));
      const newPage = {
        id: maxId + 1,
        title: "New Memory",
        content: "Write your new memory here..."
      };
      return [...prevPages, newPage];
    });
  }, []);

  const increasePageReadCount = useCallback(() => {
    setNumberOfPagesRead(prevState => 
      prevState < pages.length - 1 ? prevState + 1 : prevState
    );
  }, [pages.length]);

  const decreasePageReadCount = useCallback(() => {
    setNumberOfPagesRead(prevState => 
      prevState > 0 ? prevState - 1 : prevState
    );
  }, []);

  const jumpToPage = useCallback((pageId) => {
    const pageIndex = pages.findIndex(p => p.id === pageId);
    console.log('Jumping to page:', pageId, 'Found index:', pageIndex);
    if (pageIndex !== -1) {
      setNumberOfPagesRead(pageIndex);
    }
  }, [pages]);

  const handleWheel = useCallback((e) => {
    const container = e.currentTarget;
    
    // Prevent the default scroll behavior
    e.preventDefault();
    
    // Smooth scroll
    container.scrollBy({
      top: e.deltaY ,
      behavior: 'smooth'
    });
  }, []);


  // Update z-indices whenever pages or currentPage changes
  useEffect(() => {
    const initialZIndices = Array.from({ length: pages.length }).map((_, index) =>
      Math.abs(index - (pages.length - 1))
    );
    setZIndices(initialZIndices);
  }, [pages.length, numberOfPagesRead]);

 

  const goBack = () => {
    navigate(-1); // This goes back to the previous page
  };
  return (
<>
   <button  className="box p-2 px-4  md:absolute my-5 md:my-0  top-5 left-5" onClick={goBack}>Back</button>

    <section className="w-screen bg-gradient-to-b from-gray-900 to-violet-900  px-4 md:px-[10%] lg:px-[17%] xl:px-[27%] h-screen flex flex-col ">
    <div className='flex flex-col justify-between  items-center w-full mb-8 md:mt-8 ' >
        <h3 className="text-3xl font-semibold  text-center relative z-10 mb-3  ">  Your Memory Diary</h3>
        <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px]  w-[280px]'></span>
        </div>
      <div className="relative w-full md:w-[678px] h-[70vh] md:h-[576px] md:max-h-[70vh] md:max-w-[80vw] mx-auto" style={{ perspective: "2000px" }}>
        {pages.map((page, index) => (
          <motion.div
            key={page.id}
            className="w-full md:w-[678px] h-[70vh] md:h-[576px] md:max-h-[70vh] md:max-w-[80vw] absolute origin-left"
            style={{
              transformStyle: "preserve-3d",
              zIndex: zIndices[index],
            }}
            variants={cardVariants}
            animate={numberOfPagesRead > index ? "read" : "notRead"}
            transition={{ duration: 1 }}
          >
            <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
              <div
                className="front absolute inset-0 will-change-scroll bg-gradient-to-b overflow-y-auto Diary from-gray-950 via-blue-950 to-violet-950 border-2 border-cyan-300"
                onWheel={handleWheel}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  scrollBehavior: 'smooth',
                }}
              >
                {page.isIndex ? (
                  <Index 
                    pages={pages} 
                    currentPage={pages[numberOfPagesRead]?.id}
                    onPageSelect={jumpToPage}
                    onDelete={handleDelete}
                  />
                ) : (
                  <Page page={page} onEdit={handleEdit} JumpToindex={jumpToPage} />
                )}
              </div>
              <div
                className="back absolute inset-0 bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <br />
      <div className="mx-auto flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 px-4">
        <button
          className="text-white cursor-pointer inline-flex items-center border-2 px-4 md:px-6 py-1.5 md:py-2 border-cyan-300 text-xs md:text-sm font-medium rounded-full"
          onClick={decreasePageReadCount}
        >
          <img src={arrow} alt="" className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
          Previous
        </button>
        <button
          onClick={addNewPage}
          className="text-white border-2 cursor-pointer inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-1.5 md:py-2 border-cyan-300 text-xs md:text-sm font-medium rounded-full"
        >
          Add New Memory
        </button>
        <button
          className="text-white cursor-pointer inline-flex items-center border-2 px-4 md:px-6 py-1.5 md:py-2 border-cyan-300 text-xs md:text-sm font-medium rounded-full"
          onClick={increasePageReadCount}
        >
          Next
          <img src={arrow} alt="" className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
      <EditDialog
        page={editingPage}
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSave}
      />
    </section>
    </>
  );
});

export default Diary;
