import { server } from "./server";

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
