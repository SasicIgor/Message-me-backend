import "dotenv/config";

import httpServer from "./server.ts";

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
