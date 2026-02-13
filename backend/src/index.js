import 'dotenv/config';
import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.delete('/api/solicitudes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.solicitud.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ error: "No se pudo eliminar la solicitud" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

