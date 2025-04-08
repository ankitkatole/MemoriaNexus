import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';
import Page from "../../Components/DiaryComponents/Page";
import IndexPage from "../../Components/DiaryComponents/IndexPage";
import EditDialog from "../../Components/DiaryComponents/EditDialog";
import DiaryControls from "../../Components/DiaryComponents/DiaryControls";
import arrow from "../../assets/Arrow.svg";
import { motion } from "framer-motion";
import SERVER_URL from '../../constant.mjs';

// Default pages to use if no diary exists yet
const defaultPages = [
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
];

const cardVariants = {
  read: { rotateY: -180 },
  notRead: { rotateY: 0 },
};

const Diary = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginTokenCookie = Cookies.get('LoginStatus');
    const user = Cookies.get('Userid');
    setUserId(user);
    if (!loginTokenCookie) {
      navigate('/'); 
      return;
    }
  }, [navigate]);

  const [pages, setPages] = useState([]);
  const [zIndices, setZIndices] = useState([]);
  const [numberOfPagesRead, setNumberOfPagesRead] = useState(0);
  const [editingPage, setEditingPage] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch diary entries from API
  useEffect(() => {
    if (!userId) return;

    const fetchDiary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${SERVER_URL}/diary/${userId}`);
        if (response.data && response.data.diary && response.data.diary.length > 0) {
          // Flatten the diary array and ensure unique IDs
          const flattenedPages = response.data.diary.flat(Infinity)
            .filter((page, index, self) => 
              index === self.findIndex(p => p.id === page.id) // Remove duplicates by id
            )
            .map((page, index) => ({
              ...page,
              id: page.id !== null ? page.id : index // Assign a valid ID if null
            }));
          setPages(flattenedPages.length > 0 ? flattenedPages : defaultPages);
        } else {
          setPages(defaultPages);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setPages(defaultPages);
        } else {
          console.error("Error fetching diary:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [userId]);

  // Save diary updates to API
  const saveDiaryToServer = async (updatedPages, currentUserId) => {
    if (!currentUserId) {
      console.error("Cannot save diary: No user ID available");
      return;
    }
    
    try {
      console.log("Saving diary for user:", currentUserId);
      await axios.post(`${SERVER_URL}/diary/update/`, {
        user_id: currentUserId,
        diaryEntry: updatedPages // Send flat array
      });
    } catch (error) {
      console.error("Error saving diary:", error);
    }
  };

  const handleEdit = useCallback((page) => {
    setEditingPage(page);
    setShowEditDialog(true);
  }, []);

  const handleSave = useCallback((updatedPage) => {
    setPages(prevPages => {
      const newPages = prevPages.map(p => 
        p.id === updatedPage.id ? { ...p, ...updatedPage } : p
      );
      saveDiaryToServer(newPages, userId);
      return newPages;
    });
  }, [userId]);

  const handleDelete = useCallback((pageId) => {
    setPages(prevPages => {
      const newPages = prevPages.filter(page => page.id !== pageId);
      if (numberOfPagesRead >= newPages.length) {
        setNumberOfPagesRead(Math.max(0, newPages.length - 1));
      }
      saveDiaryToServer(newPages, userId);
      return newPages;
    });
  }, [numberOfPagesRead, userId]);

  const addNewPage = useCallback(() => {
    setPages(prevPages => {
      const maxId = Math.max(...prevPages.map(p => p.id), 0);
      const newPage = {
        id: maxId + 1,
        title: "New Memory",
        content: "Write your new memory here..."
      };
      const newPages = [...prevPages, newPage];
      saveDiaryToServer(newPages, userId);
      return newPages;
    });
  }, [userId]);

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
    e.preventDefault();
    container.scrollBy({
      top: e.deltaY,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const initialZIndices = Array.from({ length: pages.length }).map((_, index) =>
      Math.abs(index - (pages.length - 1))
    );
    setZIndices(initialZIndices);
  }, [pages.length, numberOfPagesRead]);

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <section className="w-screen bg-gradient-to-b bg-black px-4 h-screen flex items-center justify-center">
        <div className="text-cyan-300 text-xl">Loading your diary...</div>
      </section>
    );
  }

  return (
    <>
      <button className="box p-2 px-4 md:absolute my-5 md:my-0 top-5 left-5" onClick={goBack}>Back</button>
      <section className="w-screen bg-gradient-to-b bg-black px-4 md:px-[10%] lg:px-[17%] xl:px-[27%] h-screen flex flex-col">
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