import nextConnect from "next-connect";

export default nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: true, message: error.message, data: null });
  },
  onNoMatch(req, res) {
    res
      .status(405)
      .json({
        error: true,
        message: `Method ${req.method} no allowed`,
        data: null,
      });
  },
});
