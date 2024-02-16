import { server } from "./server";
import { config } from "dotenv";

config();
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
