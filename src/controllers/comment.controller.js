import { validationResult } from 'express-validator';
import { Comment, Mission } from '../models/index.js';

export const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { missionId } = req.params;
    const { content } = req.body;

    const mission = await Mission.findByPk(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      missionId,
      created_at: new Date()
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

export const getMissionComments = async (req, res) => {
  try {
    const { missionId } = req.params;
    
    const comments = await Comment.findAll({
      where: { missionId },
      order: [['created_at', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};