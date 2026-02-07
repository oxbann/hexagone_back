const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const router = express.Router();

// GET - Liste de tous les utilisateurs (admin uniquement)
router.get('/users', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, email, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Modifier le rôle d'un utilisateur (admin uniquement)
router.put('/users/:id/role', authMiddleware, checkRole('admin'), async (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  const validRoles = ['player', 'coach', 'assistant_coach', 'manager', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  try {
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    res.json({ message: 'Rôle modifié' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
