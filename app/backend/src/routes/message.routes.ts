import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import type { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Liste des conversations
router.get('/conversations', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ clientId: userId }, { proId: userId }],
    },
    include: {
      client: { select: { id: true, email: true, avatar: true } },
      pro: { select: { id: true, email: true, avatar: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: {
          messages: {
            where: { receiverId: userId, isRead: false },
          },
        },
      },
    },
    orderBy: { lastMessageAt: 'desc' },
  });

  res.json({ success: true, data: conversations });
}));

// Messages d'une conversation
router.get('/conversations/:id', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, email: true, avatar: true } },
      pro: { select: { id: true, email: true, avatar: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!conversation) throw new AppError('Conversation non trouvée', 404);
  if (conversation.clientId !== userId && conversation.proId !== userId) {
    throw new AppError('Non autorisé', 403);
  }

  // Marquer les messages comme lus
  await prisma.message.updateMany({
    where: {
      conversationId: id,
      receiverId: userId,
      isRead: false,
    },
    data: { isRead: true, readAt: new Date() },
  });

  res.json({ success: true, data: conversation });
}));

// Créer une conversation
router.post('/conversations', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    proId: z.string(),
    initialMessage: z.string().min(1).max(2000),
  });

  const data = schema.parse(req.body);
  const clientId = req.user!.id;

  // Vérifier que le client ne contacte pas lui-même
  const pro = await prisma.proProfile.findUnique({
    where: { id: data.proId },
    include: { user: true },
  });

  if (!pro) throw new AppError('Professionnel non trouvé', 404);
  if (pro.user.id === clientId) {
    throw new AppError('Vous ne pouvez pas vous contacter vous-même', 400);
  }

  // Vérifier si une conversation existe déjà
  let conversation = await prisma.conversation.findUnique({
    where: {
      clientId_proId: { clientId, proId: pro.user.id },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        clientId,
        proId: pro.user.id,
        lastMessageAt: new Date(),
      },
    });
  }

  // Créer le message
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: clientId,
      receiverId: pro.user.id,
      content: data.initialMessage,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

  // Notification
  await prisma.notification.create({
    data: {
      userId: pro.user.id,
      type: 'new_message',
      title: 'Nouveau message',
      content: 'Vous avez reçu un nouveau message',
      data: { conversationId: conversation.id, messageId: message.id },
    },
  });

  res.status(201).json({ success: true, data: { conversation, message } });
}));

// Envoyer un message
router.post('/conversations/:id/messages', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const schema = z.object({
    content: z.string().min(1).max(2000),
    isQuoteRequest: z.boolean().optional(),
    quoteDetails: z.any().optional(),
  });

  const data = schema.parse(req.body);
  const userId = req.user!.id;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
  });

  if (!conversation) throw new AppError('Conversation non trouvée', 404);
  if (conversation.clientId !== userId && conversation.proId !== userId) {
    throw new AppError('Non autorisé', 403);
  }

  const receiverId = conversation.clientId === userId ? conversation.proId : conversation.clientId;

  // Détecter coordonnées directes
  const phoneRegex = /(\+237|237)?[\s-]?(6|7)[\s-]?[0-9]{2}[\s-]?[0-9]{2}[\s-]?[0-9]{2}[\s-]?[0-9]{2}/;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  
  let content = data.content;
  if (phoneRegex.test(content) || emailRegex.test(content)) {
    // On n'empêche pas mais on pourrait logguer/avertir
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: userId,
      receiverId,
      content,
      isQuoteRequest: data.isQuoteRequest || false,
      quoteDetails: data.quoteDetails,
    },
  });

  await prisma.conversation.update({
    where: { id },
    data: { lastMessageAt: new Date() },
  });

  // Notification
  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: 'new_message',
      title: 'Nouveau message',
      content: 'Vous avez reçé un nouveau message',
      data: { conversationId: id, messageId: message.id },
    },
  });

  res.status(201).json({ success: true, data: message });
}));

// Marquer comme lu
router.put('/messages/:id/read', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  await prisma.message.updateMany({
    where: {
      id,
      receiverId: userId,
    },
    data: { isRead: true, readAt: new Date() },
  });

  res.json({ success: true });
}));

export default router;
