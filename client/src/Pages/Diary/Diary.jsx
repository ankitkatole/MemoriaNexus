import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Page from "../../Components/DiaryComponents/Page";
import IndexPage from "../../Components/DiaryComponents/IndexPage";
import EditDialog from "../../Components/DiaryComponents/EditDialog";
import DiaryControls from "../../Components/DiaryComponents/DiaryControls";
import arrow from "../../assets/Arrow.svg";
import { motion } from "framer-motion";

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

const cardVariants = {
  read: {
    rotateY: -180,
  },
  notRead: {
    rotateY: 0,
  },
};

const Diary = () => {
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
      top: e.deltaY,
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
      <button className="box p-2 px-4 md:absolute my-5 md:my-0 top-5 left-5" onClick={goBack}>Back</button>

      <section className="w-screen bg-gradient-to-b from-gray-900 to-violet-900 px-4 md:px-[10%] lg:px-[17%] xl:px-[27%] h-screen flex flex-col">
        <div className="flex flex-col justify-between items-center w-full mb-8 md:mt-8">
          <h3 className="text-3xl font-semibold text-center relative z-10 mb-3">Your Memory Diary</h3>
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px] w-[280px]"></span>
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
                    <IndexPage 
                      pages={pages} 
                      currentPage={pages[numberOfPagesRead]?.id}
                      onPageSelect={jumpToPage}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <Page page={page} onEdit={handleEdit} jumpToIndex={jumpToPage} />
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
        <DiaryControls 
          decreasePageReadCount={decreasePageReadCount}
          increasePageReadCount={increasePageReadCount}
          addNewPage={addNewPage}
          arrowIcon={arrow}
        />
        <EditDialog
          page={editingPage}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSave={handleSave}
        />
      </section>
    </>
  );
};

export default Diary;