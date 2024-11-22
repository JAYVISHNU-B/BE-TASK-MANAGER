import express from 'express';
import { createTask, updateTask, deleteTask, addComment ,fetchAllTask, fetchAllUsers} from '../controllers/tcontroller.js';
import amiddleware from '../middlewares/amiddleware.js';
import upload from "../Config/Multer.js";
const router = express.Router();

router.post('/', amiddleware,upload.single("image"), createTask);
router.put('/:id',amiddleware, updateTask);
router.delete('/:id',amiddleware, deleteTask);
router.post('/comment',amiddleware, addComment);
router.get('/',amiddleware, fetchAllTask);
router.get('/users',amiddleware, fetchAllUsers);

export default router;