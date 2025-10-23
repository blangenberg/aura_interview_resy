import express from 'express';
import reservationRoutes from './routes/reservations';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', reservationRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
