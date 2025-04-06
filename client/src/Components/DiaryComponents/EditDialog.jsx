import { useState, useEffect, memo } from "react";

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

export default EditDialog;