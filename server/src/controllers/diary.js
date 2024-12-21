const Diary = require('../models/diary');

const getDiary = async (req, res) => {
    try {
        const { user_id } = req.params;
        const diary = await Diary.findOne({ user_id });

        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }

        res.status(200).json(diary);
    } catch (error) {
        console.error("Error fetching diary: ", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateDiary = async (req, res) => {
    try {
        const { user_id, diaryEntry } = req.body;

        let diary = await Diary.findOne({ user_id });

        if (!diary) {
            diary = new Diary({
                user_id,
                diary: [diaryEntry]
            });
        } else {
            diary.diary.push(diaryEntry);
        }

        await diary.save();

        res.status(200).json(diary);
    } catch (error) {
        console.error("Error updating diary: ", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getDiary, updateDiary };
