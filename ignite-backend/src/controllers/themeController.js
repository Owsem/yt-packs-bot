import Theme from "../models/Theme.js";

// CREATE THEME (Admin)
export const createTheme = async (req, res) => {
  try {
    const { name, description, price, files, category } = req.body;

    const theme = await Theme.create({
      name,
      description,
      price,
      files,
      category,
    });

    res.status(201).json(theme);
  } catch (error) {
    res.status(500).json({ message: "Failed to create theme" });
  }
};

// GET ALL THEMES (Public)
export const getThemes = async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch themes" });
  }
};

// GET THEME BY ID (Public)
export const getThemeById = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch theme" });
  }
};

// DELETE THEME (Admin)
export const deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    await theme.deleteOne();

    res.json({ message: "Theme deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete theme" });
  }
};

