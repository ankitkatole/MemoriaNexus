import { memo } from "react";

const DiaryControls = memo(({ decreasePageReadCount, increasePageReadCount, addNewPage, arrowIcon }) => {
  return (
    <div className="mx-auto flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 px-4">
      <button
        className="text-white cursor-pointer inline-flex items-center border-2 px-4 md:px-6 py-1.5 md:py-2 border-cyan-300 text-xs md:text-sm font-medium rounded-full"
        onClick={decreasePageReadCount}
      >
        <img src={arrowIcon} alt="" className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
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
        <img src={arrowIcon} alt="" className="w-3 h-3 md:w-4 md:h-4" />
      </button>
    </div>
  );
});

export default DiaryControls;