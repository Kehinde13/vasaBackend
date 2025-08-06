import Project from '../models/projects.js';
import Client from '../models/clients.js';

// Get all projects for the logged-in VA (owner)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
    .populate('client', 'name')
    .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req, res) => {
  const { title, description, client, status, priority, dueDate, tags } = req.body;

  if (!title || !client) {
    return res.status(400).json({ error: 'Title and client are required' });
  }

  try {
    // ✅ Fetch the client by ID
    const clientDoc = await Client.findById(client);
    if (!clientDoc) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const newProject = new Project({
      title,
      description,
      client: clientDoc._id,          // store the ObjectId
      clientName: clientDoc.fullName, // ✅ use fullName instead of name
      status,
      priority,
      dueDate,
      tags,
      owner: req.user.id,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};


// Update a project
export const updateProject = async (req, res) => {
  const { title, description, client, status, priority, dueDate, tags } = req.body;

  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.client = client ?? project.client;
    project.status = status ?? project.status;
    project.priority = priority ?? project.priority;
    project.dueDate = dueDate ?? project.dueDate;
    project.tags = tags ?? project.tags;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
