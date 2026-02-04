import node_server from  "./src/app.js"

const PORT = process.env.PORT || 8080;

node_server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});